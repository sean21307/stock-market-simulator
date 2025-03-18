from django.urls import path

from wallets import views

app_name = "wallets"

urlpatterns = [
    path("", views.get_wallets, name="wallets"),
    path("new", views.create_wallet, name="create_wallet"),
    path("selected_wallet", views.get_selected_wallet, name="get_selected_wallet"),
    path("<str:wallet_name>/delete", views.delete_wallet, name="delete_wallet"),
    path("<str:wallet_name>/update", views.update_wallet, name="update_wallet"),
    path("<str:wallet_name>", views.get_shares, name="get_shares"),
    path("<str:wallet_name>/transaction-history", views.get_transaction_history, name="get_transaction_history"),
    path("<str:wallet_name>/add-shares", views.add_shares, name="add_shares"),
    path("<str:wallet_name>/sell-shares", views.sell_shares, name="sell_shares"),
    path("<str:wallet_name>/select", views.update_or_make_selected_wallet, name="update_or_make_selected_wallet"),

]

# urlpatterns = format_suffix_patterns(urlpatterns)