from flask import Flask, request, jsonify, render_template
import logging
from response_generator import ResponseGenerator

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Initialize the ResponseGenerator
response_generator = ResponseGenerator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    data = request.json
    user_message = data['user_message']

    logging.debug(f"Received user message: {user_message}")

    try:
        plan = response_generator.generate_response(user_message)
        if plan:
            logging.debug(f"Generated plan: {plan}")
            return jsonify({'plan': plan})
        else:
            logging.error("Failed to generate plan")
            return jsonify({'error': 'Failed to generate plan'}), 500
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return jsonify({'error': 'Failed to generate plan'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
