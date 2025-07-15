import pkgutil
import importlib
import inspect
from sqlalchemy.orm import Session
from backend.db.session import engine

def run_all_seeders():
    with Session(engine) as session:
        for _, module_name, _ in pkgutil.iter_modules(__path__):
            module = importlib.import_module(f"{__name__}.{module_name}")
            for name, func in inspect.getmembers(module, inspect.isfunction):
                if name.startswith("seed_"):
                    print(f"Running: {name}")
                    func(session)