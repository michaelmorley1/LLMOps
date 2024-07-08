from flask import Flask, render_template, redirect, url_for, flash
from models import db, User, Fitness, Nutrition
from forms.py import FitnessForm, NutritionForm
import os
from dotenv import load_dotenv
# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

db.init_app(app)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fitness', methods=['GET', 'POST'])
def fitness():
    form = FitnessForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if not user:
            user = User(username=form.username.data, email=f'{form.username.data}@example.com')
            db.session.add(user)
            db.session.commit()
        fitness_entry = Fitness(
            user_id=user.id,
            week_start=form.week_start.data,
            exercise=form.exercise.data,
            duration=form.duration.data
        )
        db.session.add(fitness_entry)
        db.session.commit()
        flash('Fitness details added successfully!')
        return redirect(url_for('index'))
    return render_template('fitness.html', form=form)

@app.route('/nutrition', methods=['GET', 'POST'])
def nutrition():
    form = NutritionForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if not user:
            user = User(username=form.username.data, email=f'{form.username.data}@example.com')
            db.session.add(user)
            db.session.commit()
        nutrition_entry = Nutrition(
            user_id=user.id,
            week_start=form.week_start.data,
            calories=form.calories.data,
            protein=form.protein.data,
            carbs=form.carbs.data,
            fats=form.fats.data
        )
        db.session.add(nutrition_entry)
        db.session.commit()
        flash('Nutrition details added successfully!')
        return redirect(url_for('index'))
    return render_template('nutrition.html', form=form)

if __name__ == '__main__':
    app.run(debug=True)
