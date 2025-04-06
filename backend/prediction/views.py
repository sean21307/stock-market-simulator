import os
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/ProsusAI/finbert"
HUGGING_FACE_API_KEY = os.getenv('HUGGING_FACE_TOKEN') 

FMP_API_KEY = os.environ.get("API_KEY")

from news.views import get_stock_news_titles 

def query_huggingface_api(news_titles):
    headers = {"Authorization": f"Bearer {HUGGING_FACE_API_KEY}"}
    payload = {"inputs": news_titles}
    response = requests.post(HUGGING_FACE_API_URL, headers=headers, json=payload)
    return response.json()


# takes scores from news titles and returns percentage of likely to go up, down, or stay same 
def predict_price_movement(news_titles):
    sentiment_results = query_huggingface_api(news_titles)

    print("Hugging Face API Response:", sentiment_results)

    if not isinstance(sentiment_results, list):
        return f"Error: Unexpected response - {sentiment_results}"

    sentiment_scores = {
        "positive": 0.0,
        "negative": 0.0,
        "neutral": 0.0
    }

    sentiment_counts = {
        "positive": 0,
        "negative": 0,
        "neutral": 0
    }

    for result in sentiment_results:
        if isinstance(result, list):
            for sentiment in result:
                label = sentiment["label"]
                score = sentiment["score"]
                if label in sentiment_scores:
                    sentiment_scores[label] += score
                    sentiment_counts[label] += 1

    total_score = sum(sentiment_scores.values())

    if total_score == 0:
        return {"Sentiment scores are unavailable"}
    # bunch of math lol to get percentages based on scores
    up_average_score = sentiment_scores["positive"] / sentiment_counts["positive"] if sentiment_counts["positive"] > 0 else 0
    down_average_score = sentiment_scores["negative"] / sentiment_counts["negative"] if sentiment_counts["negative"] > 0 else 0
    neutral_average_score = sentiment_scores["neutral"] / sentiment_counts["neutral"] if sentiment_counts["neutral"] > 0 else 0

    total_average_score = up_average_score + down_average_score + neutral_average_score

    up_percentage = round((up_average_score / total_average_score) * 100, 2) if total_average_score > 0 else 0
    down_percentage = round((down_average_score / total_average_score) * 100, 2) if total_average_score > 0 else 0
    neutral_percentage = round((neutral_average_score / total_average_score) * 100, 2) if total_average_score > 0 else 0

    total_percent = up_percentage + down_percentage + neutral_percentage
    if total_percent != 100:
        diff = 100 - total_percent
        up_percentage += diff  

    return {
        "likely_to_go_UP": up_percentage,
        "likely_to_go_DOWN": down_percentage,
        "likely_to_remain_NEUTRAL": neutral_percentage,
    }




@api_view(['GET'])
def stock_prediction(request, symbol):
    news_response = get_stock_news_titles(request._request, symbol)
    news_titles = news_response.data  
    recent_titles = news_titles[:4] 
    #using first 4 titles

    if not news_titles:
        return Response({"error": "No news found for the specified symbol."}, status=status.HTTP_400_BAD_REQUEST)
    
    prediction = predict_price_movement(recent_titles)
    
    return Response({
        "symbol": symbol,
        "prediction": prediction,
        "titles": recent_titles
    }, status=status.HTTP_200_OK)

