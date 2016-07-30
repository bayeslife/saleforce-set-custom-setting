
var pkg = require('./package.json');
var yargs = require('yargs');

var args = yargs
    .usage(pkg.description + "\n\n$0 -u [user] -p [password] -k [secret key] -l [login url] -m [permission]" )
    .version(pkg.version, 'version')
    .demand('u')
    .alias('u', 'user')
    .describe('u', 'Salesforce User')

    .demand('p')
    .alias('p', 'password')
    .describe('p', 'Salesforce User password')

    .demand('t')
    .alias('t', 'token')
    .describe('t', 'Salesforce User token')

    .demand('l')
    .alias('l', 'login')
    .describe('l', 'Salesforce Login Url')

    .demand('m')
    .alias('m', 'permissions')
    .describe('m', 'IAG Permission to add')

    .parse(process.argv);

var userName = args['u'];
var password = args['p'];
var secretKey = args['t'];
var loginUrl = args['l'];
var permission = args['m'];

var sf = require('node-salesforce');
var conn = new sf.Connection({
  loginUrl : loginUrl //loginUrl : 'https://test.salesforce.com'
});


conn.login(userName, password+secretKey, function(err, userInfo) {
  if (err) { return console.error(err); }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log(conn.accessToken);
  console.log(conn.instanceUrl);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);

  // conn.describeGlobal(function(err,stuff){
  //   for (var i = 0; i < stuff.sobjects.length; i++) {
  //     console.log(stuff.sobjects[i].name);
  //   }
  // });


  // conn.sobject("CustomSetting").retrieve([
  //   "a00p0000001Ptdd"
  // ], function(err, settings) {
  //   if (err) { return console.error(err); }
  //   for (var i=0; i < settings.length; i++) {
  //     console.log("Name : " + accounts[i].Name);
  //   }
  //   // ...
  // });

  var id = null;
  var value ="";
  function updateSetting(err, settings) {
    if (err) { return console.error(err); }
    console.log(settings);
    id = settings[0].Id;
    value = settings[0].Value__c;

    console.log("Id:"+ id);
    conn.sobject("DISetting__c").update({
      Id: id,
      Value__c: value + ","+ permission
    },function(err,res){
      if (err) { return console.error(err); }
      console.log(res);
    });
  }

  conn.sobject("DISetting__c").find({"Name":{$like: "DISetting_Property"}}).limit(1).execute(updateSetting);

});
