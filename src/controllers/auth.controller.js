export function loginController(req, res) {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email and password are required",
        });
    }


    const FAKE_USER = {
        email: "admin@example.com",
        password: "1234",
        role: "admin",
    }

    const isEmailOk = email === FAKE_USER.email;
    const isPasswordOk = password === FAKE_USER.password;

    if(isEmailOk && isPasswordOk) {
        return res.status(200).json({
            status: "ok",
            token: "FAKE_TOKEN_ABC123",
            user: {
                email: FAKE_USER.email,
                role: FAKE_USER.role,
            }
        })
    }

    return res.status(401).json({
        status: "error",
        message: "Invalid credentials"
    });

}

export function registerController(req, res) {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({
            status: "error",
            message: "All fields are required",
        });
    }

    return res.status(201).json({
        status: "ok",
        message: "User created (fake, no DB yet)",
        user: {
            username,
            email,
        },
    });
}
