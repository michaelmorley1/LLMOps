from flask import Flask, request, jsonify, render_template, send_from_directory, redirect, url_for, session
import sqlite3
import bcrypt
import logging
from response_generator import ResponseGenerator

app = Flask(__name__, static_folder='static')
app.secret_key = 'your_secret_key'  # Replace with a secure key

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Initialize the ResponseGenerator
response_generator = ResponseGenerator()

# Initialize the database
def init_db():
    conn = sqlite3.connect('users.db')
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

@app.context_processor
def inject_user():
    return dict(logged_in=('user_id' in session))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/sign-up')
def sign_up():
    return render_template('sign_up.html')

@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    data = request.json
    user_message = data['user_message']

    logging.debug(f"Received user message: {user_message}")

    try:
        # Retrieve user information if logged in
        if 'user_id' in session:
            conn = sqlite3.connect('users.db')
            cursor = conn.cursor()
            cursor.execute('SELECT first_name, surname, gender, height, age, weight FROM users WHERE id = ?', (session['user_id'],))
            user_info = cursor.fetchone()
            conn.close()
            
            if user_info:
                user_info_str = f"User Info - Name: {user_info[0]} {user_info[1]}, Gender: {user_info[2]}, Height: {user_info[3]}, Age: {user_info[4]}, Weight: {user_info[5]}"
                user_message = f"{user_info_str}\n{user_message}"
                logging.debug(f"User information added to message: {user_message}")

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

            # Connect to the database
            conn = sqlite3.connect('users.db')
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO users (first_name, surname, gender, height, age, weight, email, password)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (first_name, surname, gender, height, age, weight, email, hashed_password))
            conn.commit()
            session['user_id'] = cursor.lastrowid
            session['user_name'] = f"{first_name} {surname}"
            conn.close()
            return redirect(url_for('index', success='true'))
        except sqlite3.IntegrityError as e:
            logging.error(f"An error occurred while processing the form: {str(e)}")
            return jsonify({'error': 'Email already exists'}), 400
        except Exception as e:
            logging.error(f"An error occurred while processing the form: {str(e)}")
            return jsonify({'error': 'Failed to submit form'}), 500

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password').encode('utf-8')

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.checkpw(password, user[-1]):
        session['user_id'] = user[0]
        session['user_name'] = f"{user[1]} {user[2]}"
        return redirect(url_for('index'))
    else:
        return jsonify({'error': 'Invalid email or password'}), 401

@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return redirect(url_for('sign_up'))

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('SELECT first_name, surname, gender, height, age, weight, email FROM users WHERE id = ?', (session['user_id'],))
    user = cursor.fetchone()
    conn.close()

    return render_template('profile.html', user=user)

@app.route('/update-profile', methods=['POST'])
def update_profile():
    if 'user_id' not in session:
        return redirect(url_for('sign_up'))

    first_name = request.form.get('first_name')
    surname = request.form.get('surname')
    gender = request.form.get('gender')
    height = request.form.get('height')
    age = request.form.get('age')
    weight = request.form.get('weight')

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE users
        SET first_name = ?, surname = ?, gender = ?, height = ?, age = ?, weight = ?
        WHERE id = ?
    ''', (first_name, surname, gender, height, age, weight, session['user_id']))
    conn.commit()
    conn.close()

    return redirect(url_for('profile'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('sign_up'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
