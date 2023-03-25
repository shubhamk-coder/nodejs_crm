import Enquiry from "../models/enquiry.js";

const addEnquiry = async (req, res) => {
  try {
    const { name, email, courseInterest, claimedBy } = req.body;
    const enquiry = new Enquiry({ name, email, courseInterest, claimedBy });
    await enquiry.save();
    res.status(200).json({ message: "Enquiry successfully Submitted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUnclaimedEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ claimedBy: null });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getClaimedEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ claimedBy: req.user._id });
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const claimEnquiries = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    if (enquiry.claimedBy) {
      return res.status(400).json({ message: "Enquiry already claimed" });
    }
    enquiry.claimedBy = req.user._id;
    await enquiry.save();
    res.json({ message: "Enquiry claimed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  getUnclaimedEnquiries,
  getClaimedEnquiries,
  claimEnquiries,
  addEnquiry,
};
