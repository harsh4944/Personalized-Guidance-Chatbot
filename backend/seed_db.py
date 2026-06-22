import os
import json
import shutil
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_core.documents import Document

# Define the careers dataset
CAREERS_DATA = [
    {
        "name": "AI / Machine Learning Engineer",
        "description": "Designs, builds, and deploys machine learning models and artificial intelligence systems to solve complex problems and automate decision-making.",
        "skills": ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "Deep Learning", "Mathematics", "SQL", "LLMs"],
        "salary": "$120,000 - $180,000",
        "growth": "+35% (Much faster than average)",
        "roadmap": [
            "Learn Python programming and libraries like NumPy, Pandas, and Matplotlib.",
            "Master linear algebra, calculus, probability, and statistics.",
            "Study classic machine learning algorithms and implement them using Scikit-Learn.",
            "Dive into Deep Learning and Neural Networks using PyTorch or TensorFlow.",
            "Work on projects involving Natural Language Processing (NLP) or Computer Vision.",
            "Learn cloud platforms (AWS, GCP) and MLOps tools to deploy models."
        ]
    },
    {
        "name": "Full Stack Web Developer",
        "description": "Builds both the front-end (user interface) and back-end (server-side logic, databases) of web applications, ensuring a seamless user experience.",
        "skills": ["JavaScript", "React", "Node.js", "Express", "HTML/CSS", "SQL/NoSQL", "Git", "REST APIs"],
        "salary": "$85,000 - $135,000",
        "growth": "+23% (Much faster than average)",
        "roadmap": [
            "Master HTML5, CSS3, and modern JavaScript (ES6+).",
            "Learn git and command line basics.",
            "Learn a frontend framework like React, Vue, or Angular.",
            "Build server-side logic using Node.js and Express.",
            "Understand databases—relational (PostgreSQL/MySQL) and non-relational (MongoDB).",
            "Build and integrate RESTful and GraphQL APIs.",
            "Deploy applications using platforms like Vercel, Netlify, or Heroku."
        ]
    },
    {
        "name": "UI/UX Designer",
        "description": "Creates intuitive, user-friendly, and visually appealing designs for digital products by researching user behavior and designing wireframes and prototypes.",
        "skills": ["Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research", "Visual Design", "Interaction Design", "Typography"],
        "salary": "$75,000 - $115,000",
        "growth": "+16% (Faster than average)",
        "roadmap": [
            "Learn design principles: hierarchy, alignment, contrast, and color theory.",
            "Master industry-standard design tools like Figma or Sketch.",
            "Study User Experience (UX) methods: user interviews, personas, and journey mapping.",
            "Build wireframes, interactive prototypes, and high-fidelity mockups.",
            "Conduct usability testing to iterate and improve design solutions.",
            "Create a strong portfolio displaying real-world problem-solving."
        ]
    },
    {
        "name": "Data Scientist",
        "description": "Analyzes raw, unstructured data to extract actionable insights, create predictive models, and help businesses make data-driven decisions.",
        "skills": ["Python / R", "SQL", "Data Wrangling", "Data Visualization", "Statistics", "Machine Learning", "Tableau / PowerBI"],
        "salary": "$105,000 - $155,000",
        "growth": "+36% (Much faster than average)",
        "roadmap": [
            "Learn Python and R, specifically data manipulation packages (Pandas, Dplyr).",
            "Become an expert in writing SQL queries to retrieve and aggregate data.",
            "Master statistics, hypothesis testing, and exploratory data analysis (EDA).",
            "Learn data visualization tools like Tableau, PowerBI, or Seaborn.",
            "Study machine learning foundations for prediction and clustering.",
            "Practice communicating data stories to non-technical stakeholders."
        ]
    },
    {
        "name": "Cloud Solutions Architect",
        "description": "Designs and orchestrates cloud computing strategies, defining the architecture, migration path, and deployment structure of cloud services.",
        "skills": ["AWS", "Google Cloud", "Azure", "Terraform", "Docker", "Kubernetes", "Linux", "Networking"],
        "salary": "$130,000 - $190,000",
        "growth": "+27% (Much faster than average)",
        "roadmap": [
            "Gain a strong foundation in networking, Linux system administration, and servers.",
            "Learn a primary cloud provider (AWS, Azure, or GCP) and get certified.",
            "Understand containerization with Docker and orchestration with Kubernetes.",
            "Learn Infrastructure as Code (IaC) tools, primarily Terraform.",
            "Study cloud security, cost management, and high-availability architecture.",
            "Design and deploy multi-tier cloud applications."
        ]
    },
    {
        "name": "DevSecOps Engineer",
        "description": "Integrates security practices seamlessly into the DevOps continuous delivery pipeline, ensuring software is built securely from the ground up.",
        "skills": ["CI/CD", "Docker", "Kubernetes", "Shell Scripting", "App Security", "Terraform", "GitLab CI / GitHub Actions", "Ansible"],
        "salary": "$115,000 - $165,000",
        "growth": "+21% (Much faster than average)",
        "roadmap": [
            "Learn Git, Linux scripting (Bash), and networking basics.",
            "Master CI/CD tools like Jenkins, GitHub Actions, or GitLab CI.",
            "Understand container technologies (Docker, Kubernetes).",
            "Learn security scanning tools (SAST/DAST, dependency checking).",
            "Adopt Infrastructure as Code (IaC) and automate configuration management.",
            "Implement automated security policies and monitoring in production."
        ]
    },
    {
        "name": "Product Manager",
        "description": "Bridges the gap between engineering, design, and business teams, defining the product vision, strategy, and roadmap for a product.",
        "skills": ["Agile / Scrum", "Product Strategy", "User Analytics", "Market Research", "Roadmapping", "Communication", "Wireframing"],
        "salary": "$95,000 - $150,000",
        "growth": "+10% (Faster than average)",
        "roadmap": [
            "Understand the software development lifecycle (SDLC) and Agile methodologies.",
            "Develop strong business acumen and analytical skills to define KPIs.",
            "Practice market research and competitive analysis.",
            "Learn product management tools like Jira, Productboard, and Mixpanel.",
            "Improve communication and negotiation skills for cross-functional alignment.",
            "Create product requirement documents (PRDs) and prioritize backlogs."
        ]
    },
    {
        "name": "Cybersecurity Analyst",
        "description": "Protects an organization's computer networks and systems by monitoring for security breaches, investigating violations, and implementing security controls.",
        "skills": ["Firewalls", "SIEM Tools", "Network Security", "Ethical Hacking", "Cryptography", "Incident Response", "Linux/Unix"],
        "salary": "$90,000 - $140,000",
        "growth": "+32% (Much faster than average)",
        "roadmap": [
            "Understand computer networking (TCP/IP, routers, switches).",
            "Learn Linux and Windows command-line operations and security structures.",
            "Get certified in security fundamentals (Security+, CEH, or CISSP).",
            "Learn to monitor networks using SIEM tools like Wireshark and Splunk.",
            "Study vulnerability assessment, threat intelligence, and incident response.",
            "Practice ethical hacking in controlled labs (TryHackMe, HackTheBox)."
        ]
    },
    {
        "name": "Blockchain Developer",
        "description": "Develops decentralized applications (dApps) and smart contracts using cryptography and distributed ledger technologies.",
        "skills": ["Solidity", "Rust", "Ethereum", "Smart Contracts", "Web3.js / Ethers.js", "Cryptography", "Go"],
        "salary": "$110,000 - $175,000",
        "growth": "+25% (Much faster than average)",
        "roadmap": [
            "Master programming languages like JavaScript, Go, or Rust.",
            "Learn the concepts of cryptography, hashing, and peer-to-peer networking.",
            "Understand blockchain mechanics (consensus algorithms, ledgers).",
            "Learn Solidity and start writing smart contracts on Ethereum.",
            "Use development tools like Hardhat, Truffle, or Foundry.",
            "Build frontend integrations using Web3.js or Ethers.js."
        ]
    },
    {
        "name": "Mobile App Developer",
        "description": "Designs and builds responsive applications for mobile devices running on iOS or Android operating systems.",
        "skills": ["Swift / Swift UI", "Kotlin", "Flutter", "React Native", "Git", "REST APIs", "App Store / Play Store Deployment"],
        "salary": "$85,000 - $130,000",
        "growth": "+19% (Faster than average)",
        "roadmap": [
            "Choose a path: Native iOS (Swift), Native Android (Kotlin), or Cross-platform (React Native/Flutter).",
            "Master the language of choice and the platform's UI frameworks.",
            "Understand mobile-specific concerns like caching, offline state, and push notifications.",
            "Learn to consume RESTful APIs and store local data.",
            "Practice app design patterns (MVVM, MVC).",
            "Learn the process of building, signing, and deploying apps to the Apple App Store or Google Play Store."
        ]
    },
    {
        "name": "Game Developer",
        "description": "Brings video game concepts to life by programming gameplay mechanics, physics, graphics, and artificial intelligence in game engines.",
        "skills": ["C++", "C#", "Unity", "Unreal Engine", "Linear Algebra", "Physics Engines", "3D Modeling Basics", "Shaders"],
        "salary": "$70,000 - $120,000",
        "growth": "+15% (Faster than average)",
        "roadmap": [
            "Learn programming languages: C# for Unity, or C++ for Unreal Engine.",
            "Master a game engine like Unity or Unreal Engine.",
            "Study math for game development: vectors, matrices, and trigonometry.",
            "Learn game loop architecture, physics, collision detection, and AI.",
            "Build small arcade-style games to learn mechanics, audio, and UI.",
            "Collaborate on game jams to build complete small-scale games."
        ]
    },
    {
        "name": "Renewable Energy Engineer",
        "description": "Researches, designs, and installs systems that harness green energy, such as solar, wind, and geothermal power.",
        "skills": ["Solar/Wind Power Systems", "CAD", "Project Management", "Electrical Engineering", "Energy Modeling", "Sustainability"],
        "salary": "$80,000 - $125,000",
        "growth": "+12% (Faster than average)",
        "roadmap": [
            "Earn a degree in Engineering (Mechanical, Electrical, or Environmental).",
            "Study thermodynamics, fluid mechanics, and electrical grid systems.",
            "Learn computer-aided design (CAD) software and energy simulation tools.",
            "Understand environmental regulations and sustainability metrics.",
            "Get certified in energy management or project management (PMP).",
            "Work on solar, wind, or smart-grid deployment projects."
        ]
    }
]

def main():
    print("Initializing embedding model...")
    # Initialize the standard sentence transformer model
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Path to persist the vector database
    db_dir = os.path.join(os.path.dirname(__file__), "career_db")
    
    # Clear old database if it exists
    if os.path.exists(db_dir):
        print(f"Clearing existing database at {db_dir}...")
        shutil.rmtree(db_dir)
        
    documents = []
    
    print("Preparing career documents...")
    for career in CAREERS_DATA:
        # Create user-friendly content for semantic search
        content = f"Career Name: {career['name']}\nDescription: {career['description']}\nSkills: {', '.join(career['skills'])}"
        
        # Prepare structured metadata
        metadata = {
            "name": career["name"],
            "description": career["description"],
            "skills": json.dumps(career["skills"]),
            "salary": career["salary"],
            "growth": career["growth"],
            "roadmap": json.dumps(career["roadmap"])
        }
        
        doc = Document(page_content=content, metadata=metadata)
        documents.append(doc)
        
    print(f"Seeding vector store at {db_dir} with {len(documents)} careers...")
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embedding_model,
        persist_directory=db_dir
    )
    
    # Persist the vector store to disk
    vectorstore.persist()
    print("Vector database seeded successfully!")

if __name__ == "__main__":
    main()
