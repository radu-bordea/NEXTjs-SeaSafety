# Start
- npx create-next-app@latest seasafety --typescript

# Dependecies
- npm i next-themes
- npm i bcryptjs jose cookie

# Generate a secret
- openssl rand -base64 32

# Prisma Install
- npm i prisma @prisma/client
# Prisma environment setup
- npx prisma init
- npx prisma migrate dev --name init 
- npx prisma generate
- npx prisma migrate reset
- npx prisma migrate dev --name add-tutorial-relation
npx prisma migrate dev --name refactor without user

# Setup in package.json scripts
- "postinstall": "prisma generate"

# browser studio
- npx prisma studio


# Setup Prisma Global to avoid prisma instance duplication
- created a folder db in app and inside a prisma.ts file