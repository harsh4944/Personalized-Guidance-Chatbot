# Personalized Guidance Chatbot 

## ✨ Authors
### Harsh Kaushik —  Frontend Development and Backend Developer

## 📋 Project Overview
This project is a Personalized Guidance Chatbot that helps users discover suitable career options based on their interests and skills.
The system uses embeddings and a vector database to smartly match user inputs with relevant career suggestions.

## 🧠 Model / System Description
- The chatbot uses HuggingFace Embeddings to convert user text into vector format.
- Chroma (a vector database) is used to store career data and quickly retrieve relevant matches.
- LangChain Retriever logic is applied to find the most accurate career suggestions.
- GPT-2 model is used to auto-generate modern career options based on a structured text prompt.  
  The generated careers are parsed and stored into the vector database for future retrieval.
- Streamlit is used to build an interactive and user-friendly chat interface.


## Key technologies used:

Text Embeddings using all-MiniLM-L6-v2

Career Data stored and retrieved using Chroma Vectorstore

Smart Search (Top 3 suggestions) based on semantic similarity

Live Chatbot interaction using Streamlit

## 🎨 Frontend Development
The frontend interface is developed by Harsh Kaushik and Ishu Singh using Streamlit.
It includes:

Stylish chat interface

Dynamic chat history

Smooth user input experience

Career suggestions displayed in a clean and attractive manner

## 🛠 Backend Development
Backend development is handled by Krishna Parjapati and Kartik Sharma, which includes:

Setting up embeddings

Building vector store (Chroma)

Designing retriever logic to fetch career options

Integrating frontend with backend for real-time suggestions

## 🖥 Installation and Setup 

1. Clone the repository:

   https://github.com/Harshkaushik-coder/Personalized-Guidance-Chatbot.git

2. Install required packages:
   
   pip install -r requirements.txt

3. Run the Streamlit app:

   streamlit run app.py

   Open your browser

   Visit http://localhost:8501 to start chatting!

## 🔗 LinkedIn Profiles

Harsh Kaushik : https://www.linkedin.com/in/harshkaushik1/

## 📢 Conclusion
This project demonstrates the seamless integration of AI, Machine Learning, and Web Development to build an intelligent chatbot that suggests career options.
Through great teamwork and strong backend-frontend collaboration, we achieved an efficient and user-friendly solution.






#Improvements:
 - Use of js , react , css, talwind for better frontend
 - improve models with new api keys (use-> gemini for data related quries)
 - use database like sql for tabular form of resume.
 
