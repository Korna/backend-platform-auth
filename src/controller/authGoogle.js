//id
//  501593929464-und7gbcciv6259n7cc08ums16j0jd99r.apps.googleusercontent.com
let User = require('../models/Users');
//secret zhTv4ohFqHkUKxKEz2O2pRph
const googleClientId = '986346989014-4sjsthpnbabjvaipf3f4tigf6e7sqcce.apps.googleusercontent.com';
const ObjectID = require('mongodb').ObjectID;

async function verify(token, done, client) {

    const ticket = await client.verifyIdToken({
        idToken: token
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    const payloadEmail = payload.email;

    //req.body.email = email;
    //req.body.password = 'saltsaltsaltsalt';
    //req.body.email = payloadEmail;
    return payloadEmail;
}

module.exports = {
    handleToken: function (passport) {
        return function (req, res, next) {
            passport.authenticate('token', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (user) {
                    return next();
                }
                return res.json(info);
            })(req, res, next);
        };
    },

    isLoggedIn: function (req, res, next) {
        console.log('Authenticated:' + req.isAuthenticated());
        // console.log('User:' + req.user.body);

        if (req.isAuthenticated())
            return next();
        else {
            res.status(403);
            res.render('requestAuth.ejs', {message: req.flash('loginMessage')});
        }
    },

    token: function (req, res, done) {
        const token = req.body.token;
        if(token === undefined){
            console.log('no token');
            return res.status(400).json({error: 'No token specified', msg: req.body});
        }

        const {OAuth2Client} = require('google-auth-library');
        const client = new OAuth2Client(googleClientId);

        const emailPromise = verify(token, done, client).then( value => {
            return value;
        }).catch(err => {
            console.log(err);
        });

    }
};