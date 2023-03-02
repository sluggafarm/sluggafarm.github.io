var sluggaapp = {
          version: "1.2.0.0",
          apiproxy : {
              getSluggaMetadata: function (id, wallet, callback) {
                  $.ajax({ 
                     url: `https://apollo-proxy-server.azurewebsites.net/slugga/getmetadata/${id}?target=${wallet}`, type: "post", 
                     success: function (metadata) {
                        if (callback) { callback(metadata); }
                     }
                  });
              },
              getSluggaState: function (id, wallet, callback) {
                  $.ajax({ 
                     url: `https://apollo-proxy-server.azurewebsites.net/slugga/getstate/${id}?target=${wallet}`, type: "post", 
                     success: function (metadata) {
                        if (callback) { callback(metadata); }
                     }
                  });
              },
          },
          wallets : [], 
          onload: function () {
            let wallet = "";
            console.log('loading slugga app...');
            if (window.localStorage) { 
              wallet = window.localStorage.getItem('SluggaFarm_MRU_Wallet'); 
              if (wallet) { sluggaapp.wallets = [ wallet ]; sluggaapp.connectWallet();  }
            }          
            document.getElementById('connectwalletbutton').addEventListener("click", function () { sluggaapp.connectWallet(); });
            document.getElementById('disconnectwalletbutton').addEventListener("click", function () { sluggaapp.disconnectWallet(); });
          },
          disconnectWallet : function () {
              document.querySelector('.slugga-pen').style.display="none";
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
                    $('.slugga-pen').empty();
              let wallet = sluggaapp.wallets[0];
              let etherscan_api_url = `https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=0xb5483d93ee8757055298cdfe7596b36719398487&address=${wallet}&sort=asc&apikey=H5XKXE3CHZI58ZX1PSZ483N4A1F8666AY1`;
              $.ajax({ 
                  url: etherscan_api_url, success: function (txdata) {
                       let owned = txdata.result.filter( tr => tr.to === wallet );
                       let transfer_out = txdata.result.filter( tr => tr.from === wallet );
                       if (transfer_out.length > 0) {
                              console.log('deal with sold items.'); // day 1 we presume buy and hold.          
                       }
                       $.each(owned, function (idx, token) {
                           let li = `<li class="slugga" data-tokenid="${token.tokenID}" ><div class="heading"> #${token.tokenID}</div></li>`;
                           //console.log({ tokenID: token.tokenID, meta: data });       
                           $('.slugga-pen').append(li);
                           sluggaapp.apiproxy.getSluggaState(token.tokenID, wallet, function (slugga) {
                                        console.log({slugga});       
                           });
                                 
                       });
                  }   
              });
          }
        }
        window.setTimeout(function () { sluggaapp.onload(); }, 125);
