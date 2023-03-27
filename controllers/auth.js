import Employee from "../models/employee.js";
import { config } from "dotenv";
config();

const jwtSecret = process.env.JWT_SECRET;
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const employee = new Employee({ name, email, password });
    await employee.save();
    res.json({ message: "Employee registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee || employee.password !== password) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign({ email: employee.email }, jwtSecret);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { register, login };
