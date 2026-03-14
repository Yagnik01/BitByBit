import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { connectSocket, getSocket } from "../socket";

export default function ChatPage() {
  const { convId }  = useParams();   // optional — if present, open that conversation
  const navigate    = useNavigate();
  const userStr     = localStorage.getItem("user");
  const user        = userStr ? JSON.parse(userStr) : null;

  const [conversations, setConversations] = useState([]);
  const [activeConv,    setActiveConv]    = useState(null);
  const [messages,      setMessages]      = useState([]);
  const [newMsg,        setNewMsg]        = useState("");
  const [loadingConvs,  setLoadingConvs]  = useState(true);
  const [loadingMsgs,   setLoadingMsgs]   = useState(false);
  const [sending,       setSending]       = useState(false);
  const [typing,        setTyping]        = useState(null);  // { userId, userName }
  const bottomRef   = useRef(null);
  const typingTimer = useRef(null);

  // ── Load conversations ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.getConversations()
      .then(data => {
        setConversations(data);
        // If a convId param was passed in URL, open it immediately
        if (convId) {
          const found = data.find(c => c._id === convId);
          if (found) setActiveConv(found);
        }
      })
      .catch(err => console.error("getConversations error:", err))
      .finally(() => setLoadingConvs(false));
  }, [convId]);

  // ── Load messages when active conversation changes ────────────────────────
  useEffect(() => {
    if (!activeConv) return;
    setLoadingMsgs(true);
    api.getMessages(activeConv._id)
      .then(data => setMessages(data))
      .catch(() => setMessages([]))
      .finally(() => setLoadingMsgs(false));
  }, [activeConv?._id]);

  // ── Socket.IO: join/leave conversation rooms, listen for messages ─────────
  useEffect(() => {
    if (!user) return;
    const sock = connectSocket(user.id);

    sock.on("new_message", (msg) => {
      setMessages(prev => [...prev, msg]);
      // Update last message in sidebar
      setConversations(prev => prev.map(c =>
        c._id === msg.conversationId
          ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt }
          : c
      ));
    });

    sock.on("user_typing", ({ userId, userName }) => {
      if (userId !== user.id) setTyping({ userId, userName });
    });

    sock.on("user_stopped_typing", () => setTyping(null));

    return () => {
      sock.off("new_message");
      sock.off("user_typing");
      sock.off("user_stopped_typing");
    };
  }, [user?.id]);

  // Join/leave conversation socket room
  useEffect(() => {
    if (!activeConv) return;
    const sock = getSocket();
    if (sock) {
      sock.emit("join_conversation", activeConv._id);
      return () => sock.emit("leave_conversation", activeConv._id);
    }
  }, [activeConv?._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    const content = newMsg.trim();
    if (!content || !activeConv || sending) return;
    setSending(true);
    setNewMsg("");
    try {
      await api.sendMessage(activeConv._id, content);
      // The message will arrive via socket (new_message event)
    } catch (err) {
      alert("Failed to send: " + err.message);
      setNewMsg(content); // restore
    } finally {
      setSending(false);
    }
  };

  // ── Typing indicator ──────────────────────────────────────────────────────
  const handleTyping = (e) => {
    setNewMsg(e.target.value);
    const sock = getSocket();
    if (!sock || !activeConv) return;
    sock.emit("typing_start", { conversationId: activeConv._id, userId: user.id, userName: user.name });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      sock.emit("typing_stop", { conversationId: activeConv._id, userId: user.id });
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const otherParticipant = (conv) => {
    if (!conv?.participants) return null;
    return conv.participants.find(p => (p._id || p) !== user?.id);
  };

  const formatTime = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
    return d.toLocaleDateString([], { month:"short", day:"numeric" });
  };

  if (!user) return null;

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", background:"#f3f4f6" }}>

      {/* ── Conversation list (sidebar) ── */}
      <div style={{ width:"340px", background:"white", borderRight:"1px solid #e5e7eb", display:"flex", flexDirection:"column", flexShrink:0 }}>

        <div style={{ padding:"20px 24px", borderBottom:"1px solid #e5e7eb" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <h2 style={{ fontSize:"20px", fontWeight:"700", margin:0, color:"#111827" }}>Messages</h2>
            <Link to="/dashboard" style={{ fontSize:"13px", color:"#6b7280", textDecoration:"none" }}>← Back</Link>
          </div>
        </div>

        <div style={{ overflowY:"auto", flex:1 }}>
          {loadingConvs ? (
            [1,2,3].map(i => (
              <div key={i} style={{ padding:"16px 20px", borderBottom:"1px solid #f3f4f6" }}>
                <div style={{ height:"14px", background:"#f0f0f0", borderRadius:"6px", marginBottom:"8px" }}/>
                <div style={{ height:"12px", background:"#f0f0f0", borderRadius:"6px", width:"70%" }}/>
              </div>
            ))
          ) : conversations.length === 0 ? (
            <div style={{ padding:"40px 20px", textAlign:"center", color:"#9ca3af" }}>
              <div style={{ fontSize:"40px", marginBottom:"12px" }}>💬</div>
              <p style={{ margin:0, fontSize:"14px" }}>No conversations yet.</p>
              <p style={{ margin:"6px 0 0", fontSize:"13px" }}>Apply to projects to start chatting.</p>
            </div>
          ) : (
            conversations
              .sort((a,b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
              .map(conv => {
                const other   = otherParticipant(conv);
                const isActive = activeConv?._id === conv._id;
                const project  = conv.projectId;
                return (
                  <div key={conv._id}
                    onClick={() => setActiveConv(conv)}
                    style={{ padding:"16px 20px", borderBottom:"1px solid #f3f4f6", cursor:"pointer", background: isActive ? "#f0fdf4" : "white", borderLeft: isActive ? "3px solid #10b981" : "3px solid transparent" }}>
                    <div style={{ display:"flex", gap:"12px", alignItems:"flex-start" }}>
                      <div style={{ width:"44px", height:"44px", borderRadius:"50%", background:"linear-gradient(135deg,#10b981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"700", fontSize:"16px", flexShrink:0 }}>
                        {(other?.name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontWeight:"600", fontSize:"14px", color:"#111827" }}>{other?.name || "Unknown"}</span>
                          <span style={{ fontSize:"11px", color:"#9ca3af" }}>{formatTime(conv.lastMessageAt)}</span>
                        </div>
                        <p style={{ fontSize:"12px", color:"#10b981", margin:"2px 0 4px", fontWeight:"500" }}>
                          {project?.title || project?.description?.slice(0,40) || "Project"}
                        </p>
                        <p style={{ fontSize:"13px", color:"#6b7280", margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {conv.lastMessage || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* ── Chat area ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

        {!activeConv ? (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#9ca3af" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:"64px", marginBottom:"16px" }}>💬</div>
              <h3 style={{ fontSize:"20px", fontWeight:"600", color:"#374151", margin:"0 0 8px" }}>Select a conversation</h3>
              <p style={{ fontSize:"14px", margin:0 }}>Choose a conversation from the left to start chatting</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div style={{ padding:"16px 24px", background:"white", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", gap:"16px" }}>
              <div style={{ width:"44px", height:"44px", borderRadius:"50%", background:"linear-gradient(135deg,#10b981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"700", fontSize:"16px" }}>
                {(otherParticipant(activeConv)?.name || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight:"700", fontSize:"15px", margin:0, color:"#111827" }}>{otherParticipant(activeConv)?.name || "Unknown"}</p>
                <p style={{ fontSize:"12px", color:"#10b981", margin:"2px 0 0" }}>
                  {activeConv.projectId?.title || activeConv.projectId?.description?.slice(0,50) || "Project"}
                </p>
              </div>
              <div style={{ marginLeft:"auto" }}>
                <button onClick={() => navigate(`/project/${activeConv.projectId?._id || activeConv.projectId}`)}
                  style={{ padding:"8px 16px", border:"1px solid #e5e7eb", background:"white", borderRadius:"8px", cursor:"pointer", fontSize:"13px", color:"#374151" }}>
                  View Project
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"24px", display:"flex", flexDirection:"column", gap:"12px" }}>
              {loadingMsgs ? (
                <div style={{ textAlign:"center", color:"#9ca3af", padding:"40px" }}>Loading messages…</div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign:"center", color:"#9ca3af", padding:"60px 20px" }}>
                  <div style={{ fontSize:"40px", marginBottom:"12px" }}>👋</div>
                  <p style={{ margin:0, fontSize:"15px" }}>No messages yet. Say hello!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = String(msg.senderId?._id || msg.senderId) === String(user.id);
                  return (
                    <div key={msg._id || i} style={{ display:"flex", flexDirection: isMe ? "row-reverse" : "row", gap:"10px", alignItems:"flex-end" }}>
                      {!isMe && (
                        <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#4f46e5)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:"700", fontSize:"13px", flexShrink:0 }}>
                          {(msg.senderName || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ maxWidth:"65%" }}>
                        {!isMe && <p style={{ fontSize:"11px", color:"#9ca3af", margin:"0 0 4px 4px" }}>{msg.senderName}</p>}
                        <div style={{ padding:"12px 16px", borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: isMe ? "linear-gradient(135deg,#10b981,#059669)" : "white", color: isMe ? "white" : "#111827", fontSize:"14px", lineHeight:"1.5", boxShadow: isMe ? "0 2px 8px rgba(16,185,129,0.2)" : "0 2px 8px rgba(0,0,0,0.06)", border: isMe ? "none" : "1px solid #e5e7eb" }}>
                          {msg.content}
                        </div>
                        <p style={{ fontSize:"11px", color:"#9ca3af", margin:"4px 4px 0", textAlign: isMe ? "right" : "left" }}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              {typing && (
                <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                  <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"#e5e7eb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", color:"#6b7280" }}>
                    {typing.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ padding:"12px 16px", borderRadius:"18px 18px 18px 4px", background:"white", border:"1px solid #e5e7eb", fontSize:"14px", color:"#9ca3af", fontStyle:"italic" }}>
                    {typing.userName} is typing…
                  </div>
                </div>
              )}
              <div ref={bottomRef}/>
            </div>

            {/* Input area */}
            <div style={{ padding:"16px 24px", background:"white", borderTop:"1px solid #e5e7eb" }}>
              <div style={{ display:"flex", gap:"12px", alignItems:"flex-end" }}>
                <textarea
                  value={newMsg}
                  onChange={handleTyping}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message… (Enter to send)"
                  rows={1}
                  style={{ flex:1, padding:"12px 16px", border:"2px solid #e5e7eb", borderRadius:"12px", fontSize:"14px", outline:"none", resize:"none", maxHeight:"120px", lineHeight:"1.5", fontFamily:"inherit" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMsg.trim() || sending}
                  style={{ padding:"12px 24px", background: newMsg.trim() ? "linear-gradient(135deg,#10b981,#059669)" : "#e5e7eb", color: newMsg.trim() ? "white" : "#9ca3af", border:"none", borderRadius:"12px", cursor: newMsg.trim() ? "pointer" : "not-allowed", fontWeight:"600", fontSize:"14px", flexShrink:0, transition:"all 0.2s" }}>
                  {sending ? "…" : "Send"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
