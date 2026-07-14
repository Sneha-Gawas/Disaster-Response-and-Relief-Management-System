export const fallbackVolunteers = [
  {
    name: "Aisha Patel",
    email: "aisha@example.com",
    location: "Mumbai",
    skills: "Medical Support, First Aid, Counseling",
    category: "medical"
  },
  {
    name: "Daniel Kim",
    email: "daniel@example.com",
    location: "Delhi",
    skills: "Logistics, Shelter Management, Coordination",
    category: "logistics"
  },
  {
    name: "Riya Shah",
    email: "riya@example.com",
    location: "Bengaluru",
    skills: "Translation, Community Outreach, Education",
    category: "community"
  }
];

export const fallbackOrganizations = [
  {
    name: "Red Cross Relief",
    location: "Mumbai",
    contact: "+91 98765 43210",
    needs: "Medical Support, Shelter Support",
    category: "medical"
  },
  {
    name: "Community Support Network",
    location: "Delhi",
    contact: "+91 91234 56789",
    needs: "Food Distribution, Community Outreach",
    category: "community"
  },
  {
    name: "Safe Shelter Alliance",
    location: "Bengaluru",
    contact: "+91 99887 66554",
    needs: "Shelter Management, Logistics",
    category: "logistics"
  }
];

const normalizeTokens = (value = "") =>
  String(value)
    .toLowerCase()
    .split(/[,/\s]+/)
    .map((token) => token.trim())
    .filter(Boolean);

const getSkillTokens = (volunteer) => {
  const direct = normalizeTokens(volunteer?.skills);
  const category = normalizeTokens(volunteer?.category);
  return [...new Set([...direct, ...category])];
};

const getOrganizationTokens = (organization) => {
  const direct = [
    ...normalizeTokens(organization?.needs),
    ...normalizeTokens(organization?.support),
    ...normalizeTokens(organization?.category),
    ...normalizeTokens(organization?.name)
  ];
  return [...new Set(direct)];
};

const getLocationMatch = (a, b) => {
  const aLoc = String(a?.location || "").toLowerCase();
  const bLoc = String(b?.location || "").toLowerCase();
  return aLoc && bLoc && aLoc === bLoc ? 1 : 0;
};

export const buildVolunteerRecommendations = (volunteers, organizations) => {
  const volunteerList = volunteers?.length ? volunteers : fallbackVolunteers;
  const organizationList = organizations?.length ? organizations : fallbackOrganizations;

  return volunteerList.map((volunteer) => {
    const volunteerSkills = getSkillTokens(volunteer);
    const bestMatch = organizationList
      .map((organization) => {
        const orgTokens = getOrganizationTokens(organization);
        const contentOverlap = volunteerSkills.filter((skill) => orgTokens.includes(skill)).length;
        const contentScore = Math.min(1, contentOverlap / 3 + getLocationMatch(volunteer, organization) * 0.2);

        const collaborativeScore = Math.min(1, Math.max(0.1, contentOverlap / 5));
        const combinedScore = Number((contentScore * 0.7 + collaborativeScore * 0.3).toFixed(2));

        return {
          ...organization,
          score: combinedScore,
          reason: `${contentOverlap > 0 ? "Skill overlap" : "Regional fit"} + peer-style matching`
        };
      })
      .sort((a, b) => b.score - a.score)[0];

    return {
      volunteer,
      recommendation: bestMatch
    };
  });
};

export const buildOrganizationRecommendations = (organizations, volunteers) => {
  const organizationList = organizations?.length ? organizations : fallbackOrganizations;
  const volunteerList = volunteers?.length ? volunteers : fallbackVolunteers;

  return organizationList.map((organization) => {
    const orgTokens = getOrganizationTokens(organization);
    const bestMatch = volunteerList
      .map((volunteer) => {
        const volunteerSkills = getSkillTokens(volunteer);
        const contentOverlap = volunteerSkills.filter((skill) => orgTokens.includes(skill)).length;
        const contentScore = Math.min(1, contentOverlap / 3 + getLocationMatch(volunteer, organization) * 0.2);
        const collaborativeScore = Math.min(1, Math.max(0.1, contentOverlap / 5));
        const combinedScore = Number((contentScore * 0.7 + collaborativeScore * 0.3).toFixed(2));

        return {
          ...volunteer,
          score: combinedScore,
          reason: `${contentOverlap > 0 ? "Skill fit" : "Community reach"} + peer-style matching`
        };
      })
      .sort((a, b) => b.score - a.score)[0];

    return {
      organization,
      recommendation: bestMatch
    };
  });
};
