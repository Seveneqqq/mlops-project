from typing import Optional
from urllib.parse import urlencode
from supabase import create_client, Client
from fastapi.responses import RedirectResponse
from fastapi import HTTPException, Request
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")
FRONTEND_URL = os.getenv("FRONTEND_URL")

print("🔥 ENV CHECK")
print("SUPABASE_URL:", SUPABASE_URL)
print("SUPABASE_KEY:", "SET" if SUPABASE_KEY else "NONE")
print("GOOGLE_REDIRECT_URI:", GOOGLE_REDIRECT_URI)
print("FRONTEND_URL:", FRONTEND_URL)

class AuthService:

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    # 🔐 LOGIN
    @staticmethod
    def login_with_google(origin_url: str):
        print("\n🚀 LOGIN START")
        print("origin_url:", origin_url)

        params = urlencode({"next": origin_url})

        redirect_url = f"{GOOGLE_REDIRECT_URI}?{params}"
        print("redirect_to (google):", redirect_url)

        response = AuthService.supabase.auth.sign_in_with_oauth({
            "provider": "google",
            "options": {
                "redirect_to": redirect_url,
                "scopes": "email profile",
                "flow_type": "pkce",
                "query_params": {"prompt": "consent"}
            }
        })

        print("➡️ redirecting user to google:", response.url)

        return RedirectResponse(url=response.url)

    # 🔁 CALLBACK
    @staticmethod
    def login_callback(request: Request):
        print("\n🔥 CALLBACK START")

        code = request.query_params.get("code")
        next_url = request.query_params.get("next")

        print("code:", code)
        print("next_url:", next_url)

        if not code:
            print("❌ NO CODE")
            raise HTTPException(status_code=400, detail="Brak code")

        response = AuthService.supabase.auth.exchange_code_for_session({
            "auth_code": code
        })

        print("✅ Supabase response OK")

        access_token = response.session.access_token
        refresh_token = response.session.refresh_token

        print("access_token (first 20):", access_token[:20])
        print("refresh_token (first 20):", refresh_token[:20])

        redirect_to = next_url if next_url and "http" in next_url else f"{FRONTEND_URL}"

        print("➡️ FINAL REDIRECT:", redirect_to)

        redirect_response = RedirectResponse(url=redirect_to)

        print("🍪 SETTING COOKIES...")

        redirect_response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="none",
            domain=".azurewebsites.net",
            max_age=3600,
            path="/"
        )

        redirect_response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="none",
            domain=".azurewebsites.net",
            max_age=60 * 60 * 24 * 14,
            path="/"
        )

        print("✅ COOKIES SET")

        return redirect_response

    # 👤 GET USER
    @staticmethod
    def get_current_user(request: Request):
        print("\n👤 GET USER")

        auth_header: Optional[str] = request.headers.get("Authorization")
        cookie_token = request.cookies.get("access_token")

        print("Authorization header:", auth_header)
        print("Cookie token:", "EXISTS" if cookie_token else "NONE")

        token: Optional[str] = None

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            print("➡️ using HEADER token")
        else:
            token = cookie_token
            print("➡️ using COOKIE token")

        if not token:
            print("❌ NO TOKEN FOUND")
            raise HTTPException(status_code=401, detail="Brak tokena")

        user = AuthService.supabase.auth.get_user(token)

        print("user:", user)

        if not user.user:
            print("❌ INVALID USER")
            raise HTTPException(status_code=401, detail="Nieautoryzowany")

        print("✅ USER OK:", user.user.email)

        return user.user

    @staticmethod
    def get_current_user_dep(request: Request):
        return AuthService.get_current_user(request)

    # 🔒 AUTH REQUIRED
    @staticmethod
    def require_auth(request: Request):
        print("\n🔒 REQUIRE AUTH")

        user = AuthService.get_current_user(request)

        if not user:
            print("❌ AUTH FAILED")
            raise HTTPException(status_code=401, detail="Nieautoryzowany")

        print("✅ AUTH SUCCESS")

        return user