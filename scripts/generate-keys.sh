# Generate a 2048-bit private key to use on the client
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# Extract the public key from the private key, put the public key on the IdentityServer
openssl rsa -pubout -in private_key.pem -outform PEM -out public_key.pem
