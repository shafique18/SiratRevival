from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, SubmitField
from wtforms.validators import DataRequired

class BlogForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    content = TextAreaField('Content', validators=[DataRequired()])
    age_group = SelectField('Age Group', choices=[
        ('0-5', '0-5'), ('6-15', '6-15'), ('16-25', '16-25'), ('25+', '25+')
    ])
    submit = SubmitField('Publish')
