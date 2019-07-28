# Git workflow #
Here we use monorepo approach.<br/>
The problem is - we have a ot of code which shared between backend/frontend packages (isomorphic code).
We have a lot of styles & components which used across different packages also.


We have stage branch and the set of prod/* branches for each project.

For now we have 3 projects, and the set of branches with the following merge rules:
```                
                     _________________________________________   
  styles -------->  |                                         |     
  gar/* --------->  |               DEVELOP                   | 
  iso/* --------->  |   unprotected branch for dev state,     |
                    |   single for all projects               |
                    |                                         |
  sha/* --------->  |   after each merge there are several    |
                    |   piplens which launched                |                       
  feature/ ------>  |   build pipelines                       | 
                    |   - nameos dev http://142.93.44.30:30642|
                    |   - btce dev http://ip:port             |  
                    |   - be dev http://ip:port               |  
                    |_________________________________________|      
                                            |
                                            |   
                                            |
    Only @sha or @iso could                 |
    merge into stage branch                 |
    and do hotfixes                         |
                                           \ /
                     _________________________________________   
                    |                                         |     
                    |               STAGE                     | 
  iso/hot/* ------> |   The branch for internal showcases     |
                    |                                         |
  sha/hot/* ------> |   after each merge there are several    |
                    |   piplens which launched                |                       
                    |   build pipelines:                      | 
                    |   - nameos dev http://142.93.44.30:30642|
                    |   - btce dev http://ip:port             |  
                    |   - be dev http://ip:port               |  
                    |_________________________________________|     
                    |
                    |       Only sha & devops could merge without
                    |       special approve
                    |
                    |______>  prod/nameos, pipline for nameos.io 
                    |
                    |
                    |______>  prod/btce, pipline for btce.com
                    |
                    |
                    |______>  prod/be, pipline for pro
                    
```



Run in dev mode

```
npm i
npx lerna bootstrap
npm start
```
check http://localhost:8081

Run story-book

```
npm run storybook
```
check http://localhost:6006



There are mock for async API requests. I have no any idea which requests goes to backend and which to scatter
. For now there are files:
```
    packages/auctions-front/src/store/api/auction/apiImpl.ts
    packages/auctions-front/src/store/api/scatter/apiImpl.ts
```
which are empty. For now I use mockImpl.ts files in each directory:
```
    packages/auctions-front/src/store/api/auction/mockImpl.ts
    packages/auctions-front/src/store/api/scatter/mockImpl.ts
```
You can change the config of each API here , {mode: 'api'}
```$xslt
  packages\auctions-front\src\store\configureStore.ts
```
and write same callbacks there. Implemented callbacks will be merged with mock callbacks

Globals. 
api:
1. api - call real api for eos network
2. confirm - call fake api with ability to fail any api request
3. mock - call fake api with success responses everytime

eosNetwork: 
1. testnet - use testnet
2. mainnet - use mainnet

default globals for localhost: 
api=mock
eosNetwork=testnet

for any other domain
api=api
eosNetwork=mainnet

you can switch api type via query string
string once you request the Single page application first time 
like follows:
localhost:8081/auction/home?api=api&eosNetwork=mainnet
    
    
