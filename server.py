from flask import Flask, request, jsonify, render_template, send_from_directory
import logging
from response_generator import ResponseGenerator

app = Flask(__name__, static_folder='static')

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Initialize the ResponseGenerator
response_generator = ResponseGenerator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sign-up')
def sign_up():
    return render_template('sign_up.html')

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

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory('images', filename)

@app.route('/sign-form', methods=['GET', 'POST'])
def multi_step_form():
    if request.method == 'GET':
        return render_template('sign-form.html')
    
    if request.method == 'POST':
        data = request.json
        logging.debug(f"Received form data: {data}")

        # Extracting the data from the multi-step form
        first_name = data.get('first_name')
        surname = data.get('surname')
        gender = data.get('gender')
        height = data.get('height')
        age = data.get('age')
        weight = data.get('weight')

        logging.debug(f"First Name: {first_name}, Surname: {surname}, Gender: {gender}, Height: {height}, Age: {age}, Weight: {weight}")

        try:
            # Here you can process the data, save it to a database, etc.
            # For now, let's just return a success message
            return jsonify({'message': 'Form submitted successfully!'})
        except Exception as e:
            logging.error(f"An error occurred while processing the form: {str(e)}")
            return jsonify({'error': 'Failed to submit form'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
