from django.urls import path

from . import views

urlpatterns = [

    path("signup/user/", views.userSignupView.as_view()),
    path("email-verify/", views.VerifyEmail.as_view()),
    path("login/", views.customAuthToken.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("checkauth/", views.continuousVerificationView.as_view()),
    path('password-change-request/', views.passwordChangeRequest),
    path('password-change-confirm/', views.passwordChangeConfirm),

    # Page 1 Title: Annual Portfolio Dividend Payment

    path('stock-ticker-history/', views.stock_ticker_price_history.as_view()),


]
