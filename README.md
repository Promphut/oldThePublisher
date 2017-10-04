# Note:
- Developed on NodeJS 8.1.1
- Require node-gyp for building lwip (plan to remove this package)
- Development mode uses self-signed cert, other modes uses gen from CA that'll be handled via nginx.

# Development: 
- npm run dev

# Staging NextEmpire:
- NODE_ENV=staging PORT=5000 npm run build
- NODE_ENV=staging node . 
	e.g. on test server: NODE_ENV=staging PORT=5000 forever start -c 'node .' ./

# Staging Aommoney:
- NODE_ENV=staging PORT=5500 npm run build
- NODE_ENV=staging node . 
	e.g. on test server: NODE_ENV=staging PORT=5500 forever start -c 'node .' ./

# Production:
- NODE_ENV=production PORT=5000 npm run build
- NODE_ENV=production node . 
	e.g. on nextempire production server: NODE_ENV=production PORT=5000 forever start -c 'node .' ./

# Test:
- Page Request Test using Jest : npm run test:app2 <FRONTURL>
- Authentication Test using Nightmare : npm run test:auth OR npm run test:auth -- --fronturl=<FRONTURL> --backurl=<BACKURL> (default is localhost 3000 and 4000)
- Share Test using Nightmare : npm run test:share OR npm run test:share -- --fronturl=<FRONTURL> --backurl=<BACKURL> (default is localhost 3000 and 4000)
