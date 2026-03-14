import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_engine import analyze_project, verify_milestone

app = Flask(__name__)
CORS(app)


def clean_json(raw):
    cleaned = re.sub(r"```(?:json)?", "", raw).strip()
    cleaned = re.sub(r",\s*([}\]])", r"\1", cleaned)
    return cleaned


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    if not data:
        return jsonify({"error": "No JSON body"}), 400

    description = data.get("description", "")
    budget      = data.get("budget", 5000)
    timeline    = data.get("timeline", "flexible")

    if not description.strip():
        return jsonify({"error": "description is required"}), 400

    try:
        raw     = analyze_project(description, budget, timeline)
        cleaned = clean_json(raw)
        parsed  = json.loads(cleaned)
        return jsonify(parsed)
    except json.JSONDecodeError as e:
        return jsonify({"error": "AI returned invalid JSON", "raw": raw, "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/verify-milestone", methods=["POST"])
def verify():
    data = request.json
    if not data:
        return jsonify({"error": "No JSON body"}), 400

    milestone_title       = data.get("milestone_title", "")
    milestone_description = data.get("milestone_description", "")
    github_link           = data.get("github_link", "")
    project_description   = data.get("project_description", "")
    budget_allocation     = data.get("budget_allocation", 0)

    if not github_link.strip():
        return jsonify({"error": "github_link is required"}), 400

    try:
        raw     = verify_milestone(milestone_title, milestone_description, github_link, project_description, budget_allocation)
        cleaned = clean_json(raw)
        parsed  = json.loads(cleaned)
        return jsonify(parsed)
    except json.JSONDecodeError as e:
        return jsonify({"error": "AI returned invalid JSON", "raw": raw, "detail": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=8000, debug=True)
