# Simulation TP6
 
## Config
To change the control variables, you can modify the `config.js` file.

## Run
To run the simulation, you can run the following commands:
```
npm install
npm run alt1    or    npm run alt2
```
alt1: two attendance boxes for arrivals and one for exits, one single queue for arrivals
alt2: one attendance box for arrives and one for exits, arriving cars may use the exits box under two conditions:
-the box is unused
-there are, at that moment in time, no cars waiting to exit
