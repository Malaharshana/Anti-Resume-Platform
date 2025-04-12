from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

# Example match
job_description = "Looking for a React and Node.js developer"
candidate_bio = "I build web apps using React, Express and MongoDB"

emb1 = model.encode(job_description, convert_to_tensor=True)
emb2 = model.encode(candidate_bio, convert_to_tensor=True)

similarity = util.cos_sim(emb1, emb2)

print("Similarity Score:", similarity.item())
