from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import sys

# Initialize the model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Get the skills from the command line arguments
candidate_skills = sys.argv[1].split(", ")
challenge_skills = sys.argv[2].split(", ")

# Create embeddings
candidate_embedding = model.encode(" ".join(candidate_skills))
challenge_embedding = model.encode(" ".join(challenge_skills))

# Compute cosine similarity
similarity_score = cosine_similarity([candidate_embedding], [challenge_embedding])[0][0]

# Output the similarity score
print(similarity_score)
