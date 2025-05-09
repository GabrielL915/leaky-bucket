-- ARGV[1] = now (timestamp em s)
-- ARGV[2] = refill_interval (s)
-- ARGV[3] = max_tokens
-- KEYS[1] = bucket_key

local data = redis.call("HMGET", KEYS[1], "tokens", "lastRefill")
local tokens = tonumber(data[1]) or tonumber(ARGV[3])
local lastRefill = tonumber(data[2]) or tonumber(ARGV[1])

local delta = math.floor((tonumber(ARGV[1]) - lastRefill) / tonumber(ARGV[2]))
if delta > 0 then
  tokens = math.min(tonumber(ARGV[3]), tokens + delta)
  lastRefill = lastRefill + delta * tonumber(ARGV[2])
end

if tokens <= 0 then
  redis.call("HMSET", KEYS[1], "tokens", tokens, "lastRefill", lastRefill)
  return 0
else
  tokens = tokens - 1
  redis.call("HMSET", KEYS[1], "tokens", tokens, "lastRefill", lastRefill)
  return 1
end
