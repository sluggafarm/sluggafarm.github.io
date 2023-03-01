var sluggaapp = {
          version: "1.1.0.0",
          wallets : [], 
          onload: function () {
            let wallet = "";
            console.log('loading slugga app...');
            if (window.localStorage) { 
              wallet = window.localStorage.getItem('SluggaFarm_MRU_Wallet'); 
              if (wallet) {
                sluggaapp.wallets = [ wallet ]
                sluggaapp.connectWallet(); 
              }
            }          
            document.getElementById('connectwalletbutton').addEventListener("click", function () { sluggaapp.connectWallet(); });
            document.getElementById('disconnectwalletbutton').addEventListener("click", function () { sluggaapp.disconnectWallet(); });
          },
          disconnectWallet : function () {
            window.localStorage.setItem('SluggaFarm_MRU_Wallet', "");
            sluggaapp.wallets = [];
            document.getElementById('connect-button-panel').style.display="";
            document.getElementById('connected-panel').style.display="none";
            document.querySelector('figure img').style.opacity="1.0";
            document.querySelector('.lead').style.display="";
          },
          connectWallet: function () {
              if (window.ethereum) {
                  let eth = window.ethereum;
                  eth.request({ method: 'eth_requestAccounts' })
                      .then(walletsdata => {
                          sluggaapp.wallets = walletsdata;
                          if (window.localStorage) { window.localStorage.setItem('SluggaFarm_MRU_Wallet', walletsdata[0]); }
                          document.getElementById('walletLabel').innerText = sluggaapp.walletMask(sluggaapp.wallets[0]);
                          document.getElementById('connect-button-panel').style.display="none";
                          document.querySelector('.lead').style.display="none";
                          document.getElementById('connected-panel').style.display="";
                          document.querySelector('figure img').style.opacity="0.05";
                           
                          sluggaapp.getSluggaFromEtherscan();
                            
                      }).catch(err => { alert(err.message); });
              } else {
                  alert('cannot connect to MetaMask plugin.');
              }
          },
           walletMask : function (s) { 
               return s.substring(0, 6) + "...." + s.substring(s.length - 7);
           },
          getSluggaFromEtherscan : function () {
              document.querySelector('.slugga-pen').style.display="";
               
              let wallet = sluggaapp.wallets[0];
                    
              let apikey = "H5XKXE3CHZI58ZX1PSZ483N4A1F8666AY1";
              let addr = "0xb5483d93ee8757055298cdfe7596b36719398487"; //# no need to change these
              let etherscan_api_url = `https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${addr}&address=$wallet&sort=asc&apikey=${apikey}`;
              $.ajax({ 
                  url: etherscan_api_url, success: function (txdata) {
                              console.log({txdata});         
                  }   
              });
          }
        }
        window.setTimeout(function () { sluggaapp.onload(); }, 125);
