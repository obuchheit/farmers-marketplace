from django.urls import path
from .views import Signup, SignIn, SignOut

urlpatterns = [
    path('signup/', Signup.as_view(), name='signup'),
    path('signin/', SignIn.as_view(), name='signin'),
    path('signout/', SignOut.as_view(), name='signout'),
]