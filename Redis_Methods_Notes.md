Redis ek in-memory key-value store hai jo super fast hota hai (RAM based). Chat apps, caching, sessions, queues sab me use hota hai.

🧠 1. Basic Redis Commands (Core Methods)
🔹 SET (store data)
SET name "Vikram"

👉 key = name
👉 value = Vikram

✔ overwrite bhi kar deta hai

🔹 GET (read data)
GET name

👉 output: "Vikram"

🔹 DEL (delete key)
DEL name
🔹 EXISTS (check key exists)
EXISTS name

👉 return: 1 (exists) / 0 (not exists)

🔥 2. Expiry Methods (VERY IMPORTANT)
🔹 EXPIRE (set timeout)
EXPIRE token 60

👉 key 60 seconds ke baad delete ho jayega

🔹 SET with expiry
SET session "abc" EX 3600

👉 1 hour auto delete

🔹 TTL (time left)
TTL session

👉 remaining seconds

⚡ 3. List Methods (Queue / Chat history)
🔹 LPUSH (add left)
LPUSH messages "hello"
🔹 RPUSH (add right)
RPUSH messages "hi"
🔹 LRANGE (get list)
LRANGE messages 0 -1

👉 full list return

🔹 LPOP / RPOP (remove)
LPOP messages
RPOP messages
🔥 4. Hash Methods (Object storage)

👉 like JS object

🔹 HSET
HSET user:1 name "Vikram" age "22"
🔹 HGET
HGET user:1 name
🔹 HGETALL
HGETALL user:1
⚡ 5. Pub/Sub (Real-time Chat backbone)
🔹 PUBLISH
PUBLISH chat "hello world"
🔹 SUBSCRIBE
SUBSCRIBE chat
🔥 Flow:
Server A → PUBLISH → Redis Channel
Redis → All SUBSCRIBED Servers
Servers → Emit to users
🔥 6. SET (Unique collections)
🔹 SADD
SADD online_users 101
🔹 SMEMBERS
SMEMBERS online_users
🔹 SREM
SREM online_users 101
⚡ 7. SORTED SET (Leaderboard / ranking)
🔹 ZADD
ZADD leaderboard 100 "Vikram"
🔹 ZRANGE
ZRANGE leaderboard 0 -1 WITHSCORES
🔹 ZREVRANGE (top scores)
ZREVRANGE leaderboard 0 10 WITHSCORES
🔥 8. REAL WORLD USE CASES
💬 Chat App:
Pub/Sub → real-time messages
SET → online users
HASH → user data
LIST → message history
⚡ Cache System:
SET + EXPIRE
GET fast response
👥 Session Management:
login token store
auto expire sessions
🏆 Leaderboard:
ZSET for ranking systems
🧠 FINAL SUMMARY

👉 Redis = 5 core building blocks

Type	Use
String (SET/GET)	caching, tokens
List	chat messages queue
Hash	user objects
Set	unique users (online/offline)
Sorted Set	leaderboard
💡 ONE LINE MEMORY

👉 Redis = “Fast memory DB + data structures + real-time engine”