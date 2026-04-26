from typing import Optional
from urllib.parse import urlencode
from supabase import create_client, Client
from fastapi.responses import RedirectResponse
from fastapi import HTTPException, status, Request
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")


class AuthService:

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    GOOGLE_REDIRECT_URI = GOOGLE_REDIRECT_URI

    @staticmethod
    def login_with_google(origin_url: str):
        params = urlencode({"next": origin_url})

        response = AuthService.supabase.auth.sign_in_with_oauth({
            "provider": "google",
            "options": {
                "redirect_to": f"{AuthService.GOOGLE_REDIRECT_URI}?{params}",
                "scopes": "email profile",
                "flow_type": "pkce",
                "query_params": {"prompt": "consent"}
            }
        })

        return RedirectResponse(url=response.url)

    @staticmethod
    def login_callback(request: Request):
        code = request.query_params.get("code")
        next_url = request.query_params.get("next")
    
        response = AuthService.supabase.auth.exchange_code_for_session({
            "auth_code": code
        })
    
        access_token = response.session.access_token
        refresh_token = response.session.refresh_token
    
        FRONTEND_URL = os.getenv("FRONTEND_URL")
    
        redirect_to = next_url if next_url and next_url != "/" else f"{FRONTEND_URL}"
    
        redirect_response = RedirectResponse(url=redirect_to)
    
        redirect_response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,        
            samesite="none",      
            max_age=3600
        )
    
        redirect_response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=60 * 60 * 24 * 14
        )

        return redirect_response

    @staticmethod
    def get_current_user(request: Request):
        auth_header: Optional[str] = request.headers.get("Authorization")
        token: Optional[str] = None

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            token = request.cookies.get("access_token")

        if not token:
            raise HTTPException(status_code=401, detail="Brak tokena")

        user = AuthService.supabase.auth.get_user(token)

        if not user.user:
            raise HTTPException(status_code=401, detail="Nieautoryzowany")

        return user.user

    @staticmethod
    def get_current_user_dep(request: Request):
        return AuthService.get_current_user(request)

    @staticmethod
    def require_auth(request: Request):
        user = AuthService.get_current_user(request)

        if not user:
            raise HTTPException(status_code=401, detail="Nieautoryzowany")

        return user