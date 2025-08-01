from apscheduler.schedulers.background import BackgroundScheduler
from backend.db.session import SessionLocal
from backend.services.daily_news_job import daily_news_job

scheduler = BackgroundScheduler()

def start_news_scheduler():
    def job():
        db = SessionLocal()
        try:
            daily_news_job(db)
        finally:
            db.close()

    # Schedule job at 6 AM and 6 PM
    scheduler.add_job(job, 'cron', hour=6, minute=0)

    scheduler.start()
    print("✅ News scheduler started")

def stop_news_scheduler():
    scheduler.shutdown()
    print("🛑 News scheduler stopped")
