import type { BloodGroup } from '@/types'

/**
 * Maps a recipient's blood group to the donor blood groups that are
 * compatible with it (i.e. which groups can safely donate TO this group).
 * Based on standard ABO/Rh compatibility rules.
 */
const COMPATIBLE_DONORS: Record<BloodGroup, BloodGroup[]> = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // universal recipient
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'], // universal donor, but can only receive O-
}

/**
 * Returns the list of donor blood groups compatible with the given
 * recipient blood group.
 */
export function getCompatibleDonorGroups(recipientGroup: BloodGroup): BloodGroup[] {
  return COMPATIBLE_DONORS[recipientGroup] ?? []
}

/**
 * Returns true if a donor with `donorGroup` can safely donate to a
 * patient who needs `recipientGroup`.
 */
export function isCompatible(donorGroup: BloodGroup, recipientGroup: BloodGroup): boolean {
  return getCompatibleDonorGroups(recipientGroup).includes(donorGroup)
}

/** Groups a donor's blood type is able to donate to (reverse lookup). */
export function getCompatibleRecipientGroups(donorGroup: BloodGroup): BloodGroup[] {
  return (Object.keys(COMPATIBLE_DONORS) as BloodGroup[]).filter((recipient) =>
    COMPATIBLE_DONORS[recipient].includes(donorGroup)
  )
}
