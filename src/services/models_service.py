# src/services/models_service.py
from sqlalchemy.orm import Session
from src.db.default_model import DefaultModel


class ModelsService:

    @staticmethod
    def set_default_model(db: Session, model_name: str):
        # 🔥 deactivate previous
        db.query(DefaultModel).update({"is_active": False})

        model = DefaultModel(
            model_name=model_name,
            is_active=True
        )

        db.add(model)
        db.commit()

        return model

    @staticmethod
    def get_default_model(db: Session):
        model = db.query(DefaultModel).filter_by(is_active=True).first()

        if not model:
            return None

        return {
            "model_name": model.model_name
        }

    @staticmethod
    def list_models(db: Session):
        models = db.query(DefaultModel).order_by(DefaultModel.created_at.desc()).all()

        return [
            {
                "model_name": m.model_name,
                "is_active": m.is_active,
                "created_at": m.created_at
            }
            for m in models
        ]