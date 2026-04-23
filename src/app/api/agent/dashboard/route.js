// import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Agent from "@/models/Agent.model";
import Property from "@/models/Property.model";
import Agency from "@/models/Agency.model"; // Must be imported to register the schema
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    // Guard: Ensure user is logged in and is an Agent
    if (!session || session.user.role !== "Agent") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. Fetch Agent Profile with Populated Agency Data
    // We target the Agent using the User ID stored in the session
    const agent = await Agent.findOne({ user: session.user._id })
      .populate({
        path: "agency",
        select: "companyName companyLogo officialEmail officialNumber city verificationStatus companyBio",
      })
      .lean();

    if (!agent) {
      return NextResponse.json({ message: "Agent profile not found" }, { status: 404 });
    }

    // 2. Aggregate Property Statistics in Parallel
    // Based on your Property object: "agent" field matches Agent's _id
    const [totalProperties, activeProperties, pendingProperties, featuredProperties] = await Promise.all([
      Property.countDocuments({ agent: agent._id }),
      Property.countDocuments({ agent: agent._id, status: "Active" }),
      Property.countDocuments({ agent: agent._id, status: "Pending" }),
      Property.countDocuments({ agent: agent._id, isFeatured: true })
    ]);

    // 3. Data Transformation for Frontend
    // We combine Agent-level metrics with real-time Property counts
    const dashboardData = {
      profile: {
        id: agent._id,
        fullName: agent.fullName,
        profilePicture: agent.profilePicture,
        rank: agent.agentRank || "Junior",
        specialization: agent.specialization,
        serviceCity: agent.serviceCity,
        whatsapp: agent.whatsappNumber,
        isVerified: agent.isVerified,
        experienceSince: agent.experienceSince,
        about: agent.aboutAgent,
        languages: agent.languages,
        isActive: agent.isActive,
      },
      stats: {
        listings: {
          total: totalProperties,
          active: activeProperties,
          pending: pendingProperties,
          featured: featuredProperties,
        },
        engagement: {
          views: agent.totalViews || 0,
          leads: agent.totalLeads || 0,
          responseRate: agent.responseRate || 0,
          avgResponseTime: agent.avgResponseTime || "N/A",
        },
        performance: {
          rating: agent.rating || 0,
          reviews: agent.reviewCount || 0,
          closedDeals: agent.closedDealsCount || 0,
        }
      },
      agency: agent.agency ? {
        name: agent.agency.companyName,
        logo: agent.agency.companyLogo,
        email: agent.agency.officialEmail,
        phone: agent.agency.officialNumber,
        city: agent.agency.city,
        status: agent.agency.verificationStatus,
      } : null,
    };

    return NextResponse.json({ 
      success: true, 
      data: dashboardData 
    });

  } catch (error) {
    console.error("Agent Dashboard API Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" }, 
      { status: 500 }
    );
  }
}