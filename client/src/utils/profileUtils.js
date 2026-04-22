export const calculateCompanyProfileCompletion = (user) => {
  if (!user || !user.companyProfile) return 0;

  const { companyProfile } = user;
  let score = 0;
  const total = 10;

  // Basic Fields
  if (companyProfile.companyName) score++;
  if (companyProfile.description) score++;
  if (companyProfile.website) score++;
  if (companyProfile.location) score++;
  if (companyProfile.industry) score++;
  if (companyProfile.size) score++;
  if (companyProfile.foundedYear) score++;

  // Logo (check if not default)
  const defaultLogo = "https://cdn-icons-png.flaticon.com/512/4091/4091968.png";
  if (companyProfile.logo && companyProfile.logo !== defaultLogo) score++;

  // Array fields
  if (companyProfile.benefits && companyProfile.benefits.length > 0) score++;

  // Social links - check if at least one is present
  const hasSocial =
    companyProfile.socialLinks &&
    Object.values(companyProfile.socialLinks).some(
      (link) => link && link.trim() !== "",
    );
  if (hasSocial) score++;

  return Math.round((score / total) * 100);
};
