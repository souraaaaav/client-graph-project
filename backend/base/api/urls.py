from django.urls import path

from . import views

urlpatterns = [

    path("signup/user/", views.userSignupView.as_view()),
    path("email-verify/", views.VerifyEmail.as_view(), name='email-verify'),
    path("login/", views.customAuthToken.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("checkauth/", views.continuousVerificationView.as_view()),
    path('password-change-request/', views.passwordChangeRequest),
    path('password-change-confirm/', views.passwordChangeConfirm),

    # Page 1 Title: Annual Portfolio Dividend Payment

    path('stock-ticker-history/', views.stock_ticker_price_history.as_view()),
    path('annual-portfolio/', views.annual_portfolio.as_view()),
    path('stock-ticker-comparison/', views.stock_ticker_compariosn.as_view()),
    path('investment-growth/', views.investment_growth.as_view()),
    path('growth-of-share/', views.growth_of_share.as_view()),

    # saved pie chart
    path('all-pie-info/', views.getAllPieInfo),
    path('detail-pie-info/<int:id>/', views.detailPieInfo),
    path('save-pie/', views.savePieInfo),
    path('update-pie/<int:id>/', views.updatePieInfo),


]
