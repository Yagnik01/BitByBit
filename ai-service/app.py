from flask import Flask, request, jsonify
from ai_engine import analyze_requirements, qa_verification
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)


@app.route("/")
def home():
    return {"message": "AI Service Running"}


@app.route("/analyze-requirements", methods=["POST"])
def analyze():

    data = request.json
    prompt = data.get("prompt")

    result = analyze_requirements(prompt)

    return jsonify({"roadmap": result})


@app.route("/qa-verification", methods=["POST"])
def qa():

    data = request.json
    output = data.get("output")

    result = qa_verification(output)

    return jsonify({"analysis": result})


if __name__ == "__main__":
    app.run(port=8000, debug=True)