import datetime as dt
import json
import math
import random

import pandas as pd
import requests
import yfinance as yf
from base.models import PieInfo, User
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.html import strip_tags
from jwt import ExpiredSignatureError, decode, encode, exceptions
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import isVerifiedUser
from .serializers import (LoginSerializer, PieSerializer, UserSerializer,
                          userSignupSerializer)


@api_view(["POST"])
def passwordChangeRequest(request):
    given_mail = request.data['email']
    user = User.objects.get(email=given_mail)
    generatedOtp = random.randint(100000, 999999)
    user.otp = generatedOtp
    user.save()
    html_message = render_to_string(
        'password_reset_template.html', {'context': generatedOtp})
    plain_message = strip_tags(html_message)
    send_mail(
        "Password Reset for {title}".format(title="Stock Market Supervisor"),
        plain_message,
        "souravdebnath97@gmail.com",
        [given_mail],
        html_message=html_message
    )
    return Response({'message': "check your email for otp"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def passwordChangeConfirm(request):
    given_mail = request.data['email']
    given_otp = int(request.data['token'])
    pass1 = request.data['password1']
    pass2 = request.data['password2']
    print(given_mail, given_otp, pass1, pass2)
    user = User.objects.get(email=given_mail)

    if user.otp != given_otp:
        return Response({'message': "OTP doesn't match"}, status=status.HTTP_400_BAD_REQUEST)
    if pass1 != pass2:
        return Response({'message': "Password doesn't match"}, status=status.HTTP_401_BAD_REQUEST)
    if user.otp is not None and user.otp == given_otp and pass1 == pass2:
        user.set_password(pass1)
        user.otp = None
        user.save()
        return Response({'message': "Successfully changed the password"}, status=status.HTTP_200_OK)


class userSignupView(generics.GenericAPIView):
    serializer_class = userSignupSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        user_data = User.objects.get(email=serializer.data['email'])

        token = encode({'id': user_data.id},
                       settings.SECRET_KEY, algorithm='HS256')
        current_site = get_current_site(request).domain
        relative_link = reverse('email-verify')
        print('1')
        absurl = 'http://' + current_site + \
            relative_link + "?token=" + str(token)
        print('2')

        html_message = render_to_string('registration_confirm.html', {
            'fullname': user_data.fullname,
            'confirmationUrl': absurl
        })
        plain_message = strip_tags(html_message)
        send_mail(
            "Email Confirmation for Stock Market Supervisor",
            plain_message,
            "souravdebnath97@gmail.com",
            [user_data.email],
            html_message=html_message
        )

        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "message": "account created successfully",
            }
        )


class VerifyEmail(generics.GenericAPIView):

    @staticmethod
    def get(request):
        token = request.GET.get('token')
        try:
            payload = decode(token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(id=payload['id'])
            if user.isVerified is False:
                user.isVerified = True
                user.save()
            return redirect("http://localhost:3000/login")

        except ExpiredSignatureError:
            return Response({'message': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)

        except exceptions.DecodeError:
            return Response({'message': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)


class customAuthToken(generics.GenericAPIView):

    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny, ]

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key
        })


class LogoutView(APIView):
    def post(self, request, format=None):
        request.auth.delete()
        return Response(status=status.HTTP_200_OK)


class continuousVerificationView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

# Page 1 Title: Annual Portfolio Dividend Payment


class stock_ticker_price_history(generics.GenericAPIView):

    def post(self, request,):
        try:
            ticker = request.data['ticker']
            start_date = request.data['start_date']
            end_date = request.data['end_date']
            drip = request.data['drip']
            if drip == True:
                price_data = yf.download(
                    ticker, start_date, end_date).reset_index()

                start_price = price_data.iloc[0]["Adj Close"]
                end_price = price_data.iloc[-1]["Adj Close"]

                df_start_dt = pd.to_datetime(price_data.iloc[0]["Date"])
                df_end_dt = pd.to_datetime(price_data.iloc[-1]["Date"])
                day_count = (df_end_dt - df_start_dt).days

                simple_return = (end_price - start_price) / start_price
                annual_return = (simple_return + 1) ** (1 /
                                                        (day_count / 365.242199)) - 1
                price_data["% Change"] = price_data["Adj Close"].apply(
                    lambda x: round(((x / start_price) - 1) * 100, 2))
                price_data["Return"] = price_data["Adj Close"].apply(
                    lambda x: round(x - start_price, 2))
                final_list = []
                for i in range(0, len(price_data)):

                    final_list.append({'x': str(dt.datetime.strptime(str(price_data["Date"][i].date()), "%Y-%m-%d").strftime(
                        "%m/%d/%Y")), 'y': price_data["Adj Close"][i], 'return': price_data["Return"][i], 'change': price_data["% Change"][i]})

                return Response(final_list, status=status.HTTP_200_OK)
            else:
                price_data = yf.download(
                    ticker, start_date, end_date).reset_index()

                start_price = price_data.iloc[0]["Close"]
                end_price = price_data.iloc[-1]["Close"]

                df_start_dt = pd.to_datetime(price_data.iloc[0]["Date"])
                df_end_dt = pd.to_datetime(price_data.iloc[-1]["Date"])
                day_count = (df_end_dt - df_start_dt).days

                simple_return = (end_price - start_price) / start_price
                annual_return = (simple_return + 1) ** (1 /
                                                        (day_count / 365.242199)) - 1
                price_data["% Change"] = price_data["Close"].apply(
                    lambda x: round(((x / start_price) - 1) * 100, 2))
                price_data["Return"] = price_data["Close"].apply(
                    lambda x: round(x - start_price, 2))

                final_list = []
                for i in range(0, len(price_data)):

                    final_list.append({'x': str(dt.datetime.strptime(str(price_data["Date"][i].date()), "%Y-%m-%d").strftime(
                        "%m/%d/%Y")), 'y': price_data["Close"][i], 'return': price_data["Return"][i], 'change': price_data["% Change"][i]})

                return Response(final_list, status=status.HTTP_200_OK)
        except:
            print('error')
            return Response({'unavailable': True}, status=status.HTTP_400_BAD_REQUEST)


class annual_portfolio(generics.GenericAPIView):

    def get_div_yield(self, ticker, num_of_shares):
        stock_ticker = yf.Ticker(ticker)
        div_rate = stock_ticker.info['dividendRate']
        price = stock_ticker.info['open']
        if stock_ticker.info['legalType'] == 'Exchange Traded Fund':
            div_rate = stock_ticker.info['yield'] * price
        if div_rate != None:
            annual_div = float(num_of_shares) * div_rate
        else:
            annual_div = 0
        return [ticker, price, div_rate, num_of_shares, annual_div]

    def post(self, request,):
        try:
            stock_list = request.data['ticker_list']
            shares_list = request.data['share_list']
            div_yield = map(self.get_div_yield, stock_list, shares_list)
            div_list = list(div_yield)
            return Response(div_list, status=status.HTTP_200_OK)
        except:
            return Response({'unavailable': True}, status=status.HTTP_400_BAD_REQUEST)


class stock_ticker_compariosn(generics.GenericAPIView):

    def get_returns(self, tickers, start_date, end_date, total_investment, DRIP):

        start_dt = dt.datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = dt.datetime.strptime(end_date, '%Y-%m-%d')
        day_count = (end_dt - start_dt).days

        data = yf.download(tickers, start_date, end_date)

        if len(tickers) == 1:
            stock_ticker = yf.Ticker(tickers[0])
            quote_type = stock_ticker.info['quoteType']
            if quote_type == "EQUITY":
                div_yield = stock_ticker.info['dividendYield']
            elif quote_type == "ETF":
                div_yield = stock_ticker.info['yield']

            if div_yield is not None:
                daily_returns = data["Close"].pct_change()
                monthly_returns = data["Close"].resample(
                    'M').ffill().pct_change()
                daily_returns_adj = data["Adj Close"].pct_change()
                monthly_returns_adj = data["Adj Close"].resample(
                    'M').ffill().pct_change()
                cum_returns = (daily_returns + 1).cumprod()
                cum_returns_adj = (daily_returns_adj + 1).cumprod()
                cum_returns_tot_invest = (
                    cum_returns * total_investment).reset_index()
                cum_returns_tot_invest_adj = (
                    cum_returns_adj * total_investment).reset_index()
                combined_tot_returns = pd.merge(
                    cum_returns_tot_invest_adj, cum_returns_tot_invest, on=["Date"])
                combined_tot_returns.loc[0, list(combined_tot_returns.columns)[
                    1:]] = total_investment
                return combined_tot_returns

            else:
                daily_returns = data["Close"].pct_change()
                monthly_returns = data["Close"].resample(
                    'M').ffill().pct_change()
                cum_returns = (daily_returns + 1).cumprod()
                cum_returns_tot_invest = (
                    cum_returns * total_investment).reset_index()
                cum_returns_tot_invest.loc[0, list(cum_returns_tot_invest.columns)[
                    1:]] = total_investment
                return cum_returns_tot_invest

        # return without DRIP
        if DRIP == False:
            daily_returns = data["Close"].pct_change()
            monthly_returns = data["Close"].resample('M').ffill().pct_change()
            cum_returns = (daily_returns + 1).cumprod()
            cum_returns_tot_invest = (
                cum_returns * total_investment).reset_index()
            cum_returns_tot_invest.loc[0, list(cum_returns_tot_invest.columns)[
                1:]] = total_investment
            return cum_returns_tot_invest

        # return with DRIP
        elif DRIP == True:
            daily_returns_adj = data["Adj Close"].pct_change()
            monthly_returns_adj = data["Adj Close"].resample(
                'M').ffill().pct_change()
            cum_returns_adj = (daily_returns_adj + 1).cumprod()
            cum_returns_tot_invest_adj = (
                cum_returns_adj * total_investment).reset_index()
            col_list = list(cum_returns_tot_invest_adj.columns)[1:]
            cum_returns_tot_invest_adj.loc[0, col_list] = total_investment
            return cum_returns_tot_invest_adj

    def post(self, request,):
        try:
            ticker = request.data['ticker']
            start_date = request.data['start_date']
            end_date = request.data['end_date']
            drip = request.data['drip']
            investment = float(request.data['investment'])
            cum_total_returns = self.get_returns(
                ticker, start_date, end_date, investment, drip)
            df = pd.DataFrame(cum_total_returns)
            df = df.fillna(0)
            products_list = df.values.tolist()
            column_headers = list(df.columns.values)
            for i in range(0, len(products_list)):
                products_list[i][0] = str(dt.datetime.strptime(
                    str(products_list[i][0].date()), "%Y-%m-%d").strftime("%m/%d/%Y"))
            data1 = []
            if (len(ticker) == 1):
                for i in range(0, len(products_list)):
                    data1.append(
                        {'x': products_list[i][0], 'y1': products_list[i][1], 'y2': products_list[i][2]})
                column_headers = ['Date', 'with DRIP', 'without DRIP']
            elif (len(ticker) == 2):
                for i in range(0, len(products_list)):

                    data1.append(
                        {'x': products_list[i][0], 'y1': products_list[i][1], 'y2': products_list[i][2]})
            elif (len(ticker) == 3):
                for i in range(0, len(products_list)):
                    data1.append(
                        {'x': products_list[i][0], 'y1': products_list[i][1], 'y2': products_list[i][2], 'y3': products_list[i][3]})
            elif (len(ticker) == 4):
                for i in range(0, len(products_list)):
                    data1.append(
                        {'x': products_list[i][0], 'y1': products_list[i][1], 'y2': products_list[i][2], 'y3': products_list[i][3], 'y4': products_list[i][4]})
            elif (len(ticker) == 5):
                for i in range(0, len(products_list)):
                    data1.append(
                        {'x': products_list[i][0], 'y1': products_list[i][1], 'y2': products_list[i][2], 'y3': products_list[i][3], 'y4': products_list[i][4], 'y5': products_list[i][5]})
            print(data1[:10])
            return Response({'data': data1, 'ticker_serial': column_headers}, status=status.HTTP_200_OK)

        except:
            return Response({'unavailable': True}, status=status.HTTP_400_BAD_REQUEST)


class investment_growth(generics.GenericAPIView):

    def periodic_contribution_growth(self, initial_investment, avg_annual_growth_rate, additional_contributions, contribution_rate, years):

        total_return = 0
        total_contributions = 0
        portfolio_worth = initial_investment
        investment_dict = dict()

        if contribution_rate == "annual":
            for i in range(1, (years+1)):
                total_contributions += additional_contributions
                portfolio_worth = portfolio_worth * \
                    (1 + avg_annual_growth_rate)
                portfolio_worth += additional_contributions
                total_return = portfolio_worth - initial_investment - total_contributions
                investment_dict[i] = {"Portfolio Worth": round(portfolio_worth, 2), "Total Return": round(
                    total_return, 2), "Annual Contribution": round(additional_contributions, 2), "Total Contribution": round(total_contributions, 2)}
            growth_df = pd.DataFrame(investment_dict).T

        elif contribution_rate == "semi-annual":
            avg_annual_growth_rate = avg_annual_growth_rate / 2
            for i in range(1, (years+1) * 2):
                total_contributions += additional_contributions
                portfolio_worth = portfolio_worth * \
                    (1 + avg_annual_growth_rate)
                portfolio_worth += additional_contributions
                total_return = portfolio_worth - initial_investment - total_contributions
                investment_dict[i] = {"Portfolio Worth": round(portfolio_worth, 2), "Total Return": round(
                    total_return, 2), "Annual Contribution": round(additional_contributions*2, 2), "Total Contribution": round(total_contributions, 2)}
            growth_df = pd.DataFrame(
                investment_dict).T.iloc[1::2].reset_index(drop=True)
            growth_df.index = growth_df.index + 1

        elif contribution_rate == "monthly":
            avg_annual_growth_rate = avg_annual_growth_rate / 12
            for i in range(1, (years+1) * 12):
                total_contributions += additional_contributions
                portfolio_worth = portfolio_worth * \
                    (1 + avg_annual_growth_rate)
                portfolio_worth += additional_contributions
                total_return = portfolio_worth - initial_investment - total_contributions
                investment_dict[i] = {"Portfolio Worth": round(portfolio_worth, 2), "Total Return": round(
                    total_return, 2), "Annual Contribution": round(additional_contributions*12, 2), "Total Contribution": round(total_contributions, 2)}
            growth_df = pd.DataFrame(
                investment_dict).T.iloc[11::12].reset_index(drop=True)
            growth_df.index = growth_df.index + 1

        elif contribution_rate == "bi-weekly":
            avg_annual_growth_rate = avg_annual_growth_rate / 26
            for i in range(1, (years+1) * 26):
                total_contributions += additional_contributions
                portfolio_worth = portfolio_worth * \
                    (1 + avg_annual_growth_rate)
                portfolio_worth += additional_contributions
                total_return = portfolio_worth - initial_investment - total_contributions
                investment_dict[i] = {"Portfolio Worth": round(portfolio_worth, 2), "Total Return": round(
                    total_return, 2), "Annual Contribution": round(additional_contributions*26, 2), "Total Contribution": round(total_contributions, 2)}
            growth_df = pd.DataFrame(
                investment_dict).T.iloc[25::26].reset_index(drop=True)
            growth_df.index = growth_df.index + 1

        elif contribution_rate == "weekly":
            avg_annual_growth_rate = avg_annual_growth_rate / 52
            for i in range(1, (years+1) * 52):
                total_contributions += additional_contributions
                portfolio_worth = portfolio_worth * \
                    (1 + avg_annual_growth_rate)
                portfolio_worth += additional_contributions
                total_return = portfolio_worth - initial_investment - total_contributions
                investment_dict[i] = {"Portfolio Worth": round(portfolio_worth, 2), "Total Return": round(
                    total_return, 2), "Annual Contribution": round(additional_contributions*52, 2), "Total Contribution": round(total_contributions, 2)}
            growth_df = pd.DataFrame(
                investment_dict).T.iloc[51::52].reset_index(drop=True)
            growth_df.index = growth_df.index + 1

        growth_df["Initial Investment"] = initial_investment
        return growth_df

    def post(self, request,):
        initial_investment = float(request.data['investment'])
        avg_annual_growth_rate = float(request.data['growthRate'])
        additional_contributions = float(request.data['addContrib'])
        contribution_rate = request.data['contribRate']
        years = int(request.data['year'])

        growth_df = self.periodic_contribution_growth(
            initial_investment, avg_annual_growth_rate, additional_contributions, contribution_rate, years)
        final_growth = growth_df.values.tolist()
        data = []
        for i in range(0, len(final_growth)):
            data.append({'year': i+1, 'worth': final_growth[i][0], 'return': final_growth[i][1],
                        'aContrib': final_growth[i][2], 'tContrib': final_growth[i][3], 'investment': final_growth[i][4]})

        return Response(data, status=status.HTTP_200_OK)


class growth_of_share(generics.GenericAPIView):

    def share_growth(self, initial_shares, initial_share_price, avg_annual_growth_rate, div_yield, annual_div_growth_rate, years):
        investment_dict = dict()
        share_price = initial_share_price
        shares = initial_shares
        total_div_earned = 0
        yearly_div_earned = 0
        portfolio_worth = 0

        for i in range(1, years+1):
            div_yield = div_yield * (1 + annual_div_growth_rate)
            share_price = share_price * (1 + avg_annual_growth_rate)
            # per 1 share
            annual_div_payout = div_yield * share_price
            # shares with DRIP
            shares = shares + (shares*div_yield)
            # total div earned
            yearly_div_earned = shares * annual_div_payout
            total_div_earned += yearly_div_earned
            investment_dict["Year {}".format(i)] = {"Share Price": round(share_price, 2), "Shares": round(
                shares, 2), "Annual Dividends Earned": round(yearly_div_earned, 2), "Total Dividends Earned": round(total_div_earned, 2)}

        return pd.DataFrame(investment_dict).T

    def post(self, request,):
        initial_shares = float(request.data['iniShare'])
        initial_share_price = float(request.data['iniPrice'])
        avg_annual_growth_rate = float(request.data['growthRate'])
        div_yield = float(request.data['divYeild'])
        annual_div_growth_rate = float(request.data['annualDiv'])
        years = int(request.data['year'])
        x = self.share_growth(initial_shares, initial_share_price,
                              avg_annual_growth_rate, div_yield, annual_div_growth_rate, years)

        final_list = x.values.tolist()
        data = []
        for i in range(0, len(final_list)):
            data.append({'year': (i+1), 'iniShare': final_list[i][0], 'iniPrice': final_list[i]
                        [1], 'growthRate': final_list[i][2], 'divYeild': final_list[i][3], })

        return Response(data, status=status.HTTP_200_OK)


@api_view(["POST"])
def getAllPieInfo(request):
    user = User.objects.get(email=request.data['email'])
    allPie = PieInfo.objects.filter(user=user)
    seriializer = PieSerializer(allPie, many=True)
    x = json.loads(json.dumps(seriializer.data))
    print(json.loads(x[0]['dataArr'])[0])
    return Response(x, status=status.HTTP_200_OK)


@api_view(["POST"])
def detailPieInfo(request, id):
    user = User.objects.get(email=request.data['email'])
    detailPie = PieInfo.objects.get(user=user, id=id)
    seriializer = PieSerializer(detailPie, many=False)
    x = json.loads(json.dumps(seriializer.data))
    stock_list = json.loads(x['dataArr'])[0]
    shares_list = json.loads(x['dataArr'])[1]

    def get_div_yield(ticker, num_of_shares):
        stock_ticker = yf.Ticker(ticker)
        div_rate = stock_ticker.info['dividendRate']
        price = stock_ticker.info['open']
        if stock_ticker.info['legalType'] == 'Exchange Traded Fund':
            div_rate = stock_ticker.info['yield'] * price
        if div_rate != None:
            annual_div = float(num_of_shares) * div_rate
        else:
            annual_div = 0
        return [ticker, price, div_rate, num_of_shares, annual_div]

    div_yield = map(get_div_yield, stock_list, shares_list)
    div_list = list(div_yield)
    return Response({'data': div_list, 'name': x['name']}, status=status.HTTP_200_OK)


@api_view(["POST"])
def savePieInfo(request):
    user = User.objects.get(email=request.data['email'])
    test = PieInfo.objects.filter(user=user)
    if len(test) >= 5:
        return Response({'overflow': True}, status=status.HTTP_200_OK)
    p = PieInfo.objects.create(
        user=user, name=request.data['name'], dataArr=json.dumps(request.data['dataArr']))
    print('1')
    p.save()
    print('2')
    return Response({'success': 'perfect'}, status=status.HTTP_200_OK)


@api_view(["POST"])
def updatePieInfo(request, id):
    user = User.objects.get(email=request.data['email'])
    p = PieInfo.objects.get(user=user, id=id)
    p.name = request.data['name']
    p. dataArr = json.dumps(request.data['dataArr'])
    p.save()
    print('2')
    return Response({'success': 'perfect'}, status=status.HTTP_200_OK)


@api_view(["POST"])
def deletePieinfo(request, id):
    user = User.objects.get(email=request.data['email'])
    p = PieInfo.objects.get(user=user, id=id)
    p.delete()
    return Response({'success': 'perfect'}, status=status.HTTP_200_OK)
