from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for
import sqlite3
import bcrypt
import logging
from response_generator import ResponseGenerator

app = Flask(__name__, static_folder='static')

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Initialize the ResponseGenerator
response_generator = ResponseGenerator()

# Initialize the database
def init_db():
    conn = sqlite3.connect('users.db', timeout=10)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            surname TEXT NOT NULL,
            gender TEXT NOT NULL,
            height INTEGER NOT NULL,
            age INTEGER NOT NULL,
            weight INTEGER NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/sign-up')
def sign_up():
    success = request.args.get('success')
    return render_template('sign_up.html', success=success)

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

@app.route('/multi-step-form', methods=['GET', 'POST'])
def multi_step_form():
    if request.method == 'GET':
        return render_template('sign-form.html')
    
    if request.method == 'POST':
        first_name = request.form.get('first_name')
        surname = request.form.get('surname')
        gender = request.form.get('gender')
        height = request.form.get('height')
        age = request.form.get('age')
        weight = request.form.get('weight')
        email = request.form.get('email')
        password = request.form.get('password')

        logging.debug(f"First Name: {first_name}, Surname: {surname}, Gender: {gender}, Height: {height}, Age: {age}, Weight: {weight}, Email: {email}, Password: {password}")

        try:
            # Hash the password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            # Connect to the database with a timeout
            conn = sqlite3.connect('users.db', timeout=10)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO users (first_name, surname, gender, height, age, weight, email, password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (first_name, surname, gender, height, age, weight, email, hashed_password))
            conn.commit()
            conn.close()
            return jsonify({'message': 'Form submitted successfully!'}), 200
        except sqlite3.IntegrityError as e:
            logging.error(f"An error occurred while processing the form: {str(e)}")
            return jsonify({'error': 'Email already exists'}), 400
        except sqlite3.OperationalError as e:
            logging.error(f"An error occurred while processing the form: {str(e)}")
            return jsonify({'error': 'Database is locked, please try again later'}), 500
        except Exception as e:
            logging.error(f"An error occurred while processing the form: {str(e)}")
            return jsonify({'error': 'Failed to submit form'}), 500

@app.route('/signup_form')
def signup_form():
    return render_template('sign_up.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
