from . import router
from fastapi import Depends, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from backend.db.session import get_db
from backend.models.sqlalchemy.contactus import Feedback, Suggestion, Report
from backend.models.pydantic.contactus import FeedbackCreate,SuggestionCreate, ReportCreate

@router.post("/feedback")
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    try:
        db_feedback = Feedback(**feedback.dict())
        db.add(db_feedback)
        db.commit()
        db.refresh(db_feedback)
        return {"message": "Feedback submitted successfully"}
    except Exception as e:
        return {"Error": "Feedback submission failed"}

@router.post("/suggestions")
def create_suggestion(suggestion: SuggestionCreate, db: Session = Depends(get_db)):
    try:
        db_suggestion = Suggestion(**suggestion.dict())
        db.add(db_suggestion)
        db.commit()
        db.refresh(db_suggestion)
        return {"message": "Suggestion submitted successfully"}
    except Exception as e:
        return {"Error": "Suggestion submission failed"}

@router.post("/report")
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    try:
        db_report = Report(**report.dict())
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        return {"message": "Report submitted successfully"}
    except Exception as e:
        return {"Error": "Report submission failed"}