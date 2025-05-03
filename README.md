# Stock Market Simulator

## Features
- Simulate market/limit buy and sell orders using real-time stock data
- Create separate wallets to test different strategies
- Setup watchlists to easily view different sets of stocks
- Examine detailed information about a company and recent news related to its stock
- View insights about today's top gainers/losers, congress trading activity, AI price prediction, and more
- Communicate with other users on the community forums

## Screenshots
Wallet Page
![StockSc1](https://github.com/user-attachments/assets/75f02cd7-278e-4eaf-a318-f11636dd7e18)

Top Declining Stocks
![Losers](https://github.com/user-attachments/assets/ee9ce8d7-f9da-4c1e-9bac-1e5dd63387ad)

Specific Stock Page
![StockPageTOp](https://github.com/user-attachments/assets/eb69cee8-61c4-4521-b0e4-b235e8b0e74d)
![StockPageBottom](https://github.com/user-attachments/assets/d257f26f-90e3-47c4-88e0-eb36fe89a6dd)

Insights
![Insights](https://github.com/user-attachments/assets/8d982dcb-c660-4413-a643-e1ffbc6cc932)

Adding stock to watchlists
![AddWatchlist](https://github.com/user-attachments/assets/2c1ccbd2-d005-402d-bd9b-e463ef6f5eee)


# 📈 Stock Market Simulator

This project simulates stock market activity using a **React** frontend and a **Python** backend. It's ideal for learning about web development, API integration, and financial technology.

---

## 🧰 Software Requirements

Before running the project, install the following tools:

| Software          | Purpose                            | Download Link                            |
|------------------|-------------------------------------|-------------------------------------------|
| **Git**           | To clone the project repository     | [https://git-scm.com/](https://git-scm.com/) |
| **Node.js**       | To run the frontend (React)         | [https://nodejs.org/](https://nodejs.org/)   |
| **Python 3.9+**   | To run the backend (Python API)     | [https://www.python.org/](https://www.python.org/) |
| **MySQL**         | Backend database                    | [https://www.mysql.com/](https://www.mysql.com/) |
| (Optional) **VS Code** | Recommended code editor       | [https://code.visualstudio.com/](https://code.visualstudio.com/) |

---

## 🚀 Installation Guide (Step-by-Step)

### 1. Clone the Repository

```bash
git clone https://github.com/sean21307/stock-market-simulator.git
cd stock-market-simulator
```

---

### 2. Set Up the Frontend (Angular)

```bash
cd frontend
npm install -f
npm start
```

This starts the frontend at: [http://localhost:4200](http://localhost:4200)

---

### 3. Set Up the Backend (Python)

```bash
cd ../backend
python -m venv venv
```

#### 👉 Activate the virtual environment:

- **Windows:**
  ```bash
  venv\Scripts\activate
  ```

- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

#### Install Python dependencies:

```bash
pip install -r requirements.txt
```

---

### 4. Configure Environment Variables

Create a `.env` file in the **`backend`** folder and add:

```env
DB_PORT="3306"
DB_NAME="stock-market-schema"
DB_HOST="localhost"
DB_USERNAME="your_mysql_username"
DB_PASS="your_mysql_password"
API_KEY="your_fmp_api_key"  # FMP (Financial Modeling Prep) API Key
HUGGING_FACE_TOKEN="hf_your_token"  # Hugging Face API Token
```

> 🔐 Replace the placeholders with your actual credentials and API keys.

---

### 5. Start the Backend Server

Be inside the root backend folder with virtual environment activated:

```bash
python manage.py runserver
```

---

## 💡 Notes

- Make sure MySQL is installed and running before starting the backend.
- Frontend runs on port `4200`.

---

### 📝 Note: Use `start_project.py` Script

After completing all the installation steps above, you can use the `start_project.py` script to automatically run the project. This script will launch both the frontend and backend servers for you.

Simply run:

```bash
python start_project.py
```

---
## ❓Helpful Links

- [Install Python and pip](https://realpython.com/installing-python/)
- [Install MySQL and create a database](https://dev.mysql.com/doc/)
- [Get a Free FMP API Key](https://financialmodelingprep.com/developer/docs/)
- [Get a Hugging Face Token](https://huggingface.co/docs/hub/security-tokens)

---

## 📬 Questions?

If you get stuck, feel free to open an issue or ask for help!