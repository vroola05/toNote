<html>
    <title></title>
    <style>
        .container { display: flex; flex-direction: column; width: 500px; margin: 0 auto; border: #ececec solid 1px; box-shadow: #d8d8d8 0px 0px 5px; }
        .container .inner { margin:10px; padding:10px; border-bottom: #ececec solid 1px; }
        .container .inner:last-child { border-bottom: none; }
        .container .inner .block { display: flex; flex-direction: column; }
        .container .inner .block .input{ display: flex; flex-direction: row; padding:10px }
        .container .inner .block .input label { width: 50%;}
        .container .inner .block .input input { width: 50%; background: #f2f2f2; border-radius: 3px; border: #dbdbdb solid 1px; box-shadow: #d8d8d8 5px 5px 5px; }
    </style>
    <script type="">

        window.onload = function() {
            let input = document.forms['conf'].elements;

            fetch('installer.php', { method: 'GET',  headers: { Accept: 'application/json', }}).then(response => response.json()).then((conf) => {
                input["dbHost"].value = conf.dbHost;
                input["dbPort"].value = conf.dbPort;
                input["dbDatabase"].value = conf.dbDatabase;
                input["dbUsername"].value = conf.dbUsername;
                input["serverUrl"].value = conf.serverUrl;
            });

            document.forms['conf'].onsubmit = function(e){
                let conf = {
                    "dbHost": input["dbHost"].value,
                    "dbPort": input["dbPort"].value,
                    "dbDatabase": input["dbDatabase"].value,
                    "dbUsername": input["dbUsername"].value,
                    "dbPassword": input["dbPassword"].value,
                    "serverUrl": input["serverUrl"].value
                }
                 

                fetch('installer.php', { method: 'POST',  headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(conf)}).then(response => response.json()).then((out) => {
                    console.log(out);
                });
                e.preventDefault();
            }
        };
    </script>
    <body>
        <form name="conf">
            <div class="container" >
                <div class="inner database">
                    <h2>Database</h2> 
                    <div class="block host">
                        <h3>Host</h3>
                        <div class="input">
                            <label>Hostname</label>
                            <input name="dbHost" type="text" />
                        </div>
                        <div class="input">
                            <label>Port</label>
                            <input name="dbPort" type="text" />
                        </div>
                        <div class="input">
                            <label>Database name</label>
                            <input name="dbDatabase" type="text" />
                        </div>
                    </div>
                    <div class="block user">
                        <h3>User</h3> 
                        <div class="input">
                            <label>Username</label>
                            <input name="dbUsername" type="text" />
                        </div>
                        <div class="input">
                            <label>Password</label>
                            <input name="dbPassword" type="password" />
                        </div>
                    </div>
                </div>
                <div class="inner server"> 
                    <div class="block">
                        <h2>Server</h2>
                        <div class="input">
                            <label>Url</label>
                            <input name="serverUrl" type="text" />
                        </div>
                    </div>
                </div>
                <div class="inner client">
                    <div class="block">
                        <h2>Admin user</h2>
                        <div class="input">
                            <label>Username</label>
                            <input name="clientUsername" type="text" />
                        </div>
                        <div class="input">
                            <label>Password</label>
                            <input name="clientPassword" type="text" />
                        </div>
                        <div class="input">
                            <label>Re-Password</label>
                            <input name="clientRePassword" type="text" />
                        </div>
                    </div>
                </div>
                <div class="inner">
                    <div class="input">
                        <input name="submit" type="submit" value="Install" />
                    </div>
                </div>
            </div>
        </form>
    </body>
</html>