import json
import re
from flask import Flask,request,jsonify
from ai_engine import analyze_project

app = Flask(__name__)

@app.route("/analyze",methods=["POST"])
def analyze():

    data = request.json

    description = data.get("description")
    budget = data.get("budget")
    timeline = data.get("timeline")

    result = analyze_project(description,budget,timeline)

    cleaned = re.sub(r"```json|```","",result).strip()

    parsed = json.loads(cleaned)

    return jsonify(parsed)

if __name__ == "__main__":
    app.run(port=8000, debug=True)