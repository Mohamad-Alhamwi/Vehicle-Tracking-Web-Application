module.exports = 
{
    isAuthenticatedUser : function(req, res, next) 
    {
        if (req.isAuthenticated()) 
        {
            if(req.user.role === 'customer')
            {
                return next() ; 
            }
            
            return res.status(401).send("You are not authorized to view that resource.");
        }

        req.flash('error_msg', 'Please log in to view that resource') ;
        res.redirect('/login') ;
    },

    isAuthenticatedAdmin : function(req, res, next) 
    {
        if (req.isAuthenticated()) 
        {
            if(req.user.role === 'admin')
            {
                return next() ; 
            }
            
            return res.status(401).send("You are not authorized to view that resource.");
        }

        req.flash('error_msg', 'Please log in to view that resource') ;
        res.redirect('/login') ;
    }
} ;