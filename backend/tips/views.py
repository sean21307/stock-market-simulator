from rest_framework.decorators import api_view
from rest_framework.response import Response
import random
from .constants import INVESTING_TIPS


@api_view(['GET'])
def get_investing_tips(request):
    selected_tips = random.sample(INVESTING_TIPS, 10)
    return Response({"tips": selected_tips})