// Code below is based on your setup, with `noOfPeers` and `noOfFollowers` updated.

import img1 from "../assets/images/Open Peeps - Bust.png";
import img5 from "../assets/images/Screenshot 2025-07-05 at 9.17.23 PM.png";
import img6 from "../assets/images/Screenshot 2025-07-05 at 9.17.52 PM.png";
import img7 from "../assets/images/Screenshot 2025-07-05 at 9.20.43 PM.png";
import img8 from "../assets/images/Screenshot 2025-07-05 at 9.20.54 PM.png";
import img9 from "../assets/images/Screenshot 2025-07-05 at 9.21.04 PM.png";
import img2 from "../assets/images/smiling-young-man-illustration_1308-174669.avif";
import img3 from "../assets/images/beautiful-woman-avatar-character-icon-free-vector.jpg";
import img4 from "../assets/images/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg";

const userDetails = localStorage?.getItem("kractos") ? decrypt2(localStorage?.getItem("kractos")) : null;
import type { GraphLink, GraphNode } from "../components/fragments/NodeMapComp";
import { decrypt2 } from "./encrypt";

const imagesArray = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
const groups = [
  "#FF8C00",
  "#1E90FF",
  "#8A2BE2",
  "#32CD32",
  "#DC143C",
  "#00CED1",
  "#FF1493",
  "#6495ED",
];
const addresses = [
  "123 Health St, New York, NY",
  "456 Wellness Ave, San Francisco, CA",
  "789 Care Blvd, Boston, MA",
  "321 Med Lane, Chicago, IL",
  "654 Clinic Rd, Seattle, WA",
  "987 Doctor Dr, Austin, TX",
  "111 Therapy Pl, Miami, FL",
];
const designations = [
  {
    title: "Cardiologist",
    desc: "Experienced and compassionate doctor specialising in cardiology.",
  },
  {
    title: "Neurologist",
    desc: "Expert in treating disorders of the nervous system.",
  },
  {
    title: "Oncologist",
    desc: "Specialist in diagnosing and treating cancer.",
  },
  {
    title: "Pediatrician",
    desc: "Provides medical care for infants, children, and adolescents.",
  },
  {
    title: "Dermatologist",
    desc: "Expert in treating skin-related conditions.",
  },
  {
    title: "Psychiatrist",
    desc: "Specialist in mental health and psychiatric disorders.",
  },
  {
    title: "Endocrinologist",
    desc: "Treats hormone imbalances and endocrine disorders.",
  },
];
const universities = [
  { school: "Harvard Medical School", degree: "MD" },
  { school: "Stanford University", degree: "MBBS" },
  { school: "Johns Hopkins University", degree: "DO" },
  { school: "University of Oxford", degree: "MD" },
  { school: "Cambridge University", degree: "MBBS" },
  { school: "Yale University", degree: "MD" },
  { school: "University of Toronto", degree: "MD" },
];
export const userName = `${userDetails?.first_name} ${userDetails?.last_name}`;

const addToNamesList = (list: string[]): string[] => {
  if (Number(list?.length) > 0) {
    if ( userDetails && Object?.keys(userDetails)?.length > 0) {
      const newList = [...list, userName];
      return newList;
    } else {
      return list;
    }
  } else {
    return [];
  }
};
const defaultNames = [
  "Ada Lovelace",
  "Alan Turing",
  "Grace Hopper",
  "Margaret Hamilton",
  "Huge Berners-Lee",
  "Linus Torvalds",
  "Katherine Depson",
  "Dennis Ritchie",
  "Barbara Liskov",
  "Donald Knuth",
  "Brian Kernighan",
  "John McCarthy",
  "Claude Shannon",
  "James Gosling",
  "Guido van Rossum",
  "Ken Thompson",
  "Edsger Dijkstra",
  "Niklaus Wirth",
  "Steve Wozniak",
  "Sheryl Sandberg",
  "Bukola Ajibola",
  "Toke Makinwa",
  "Timi Paul",
  "Williams Books",
  "Oke Atinuke",
  "Alice Johnson",
  "Bob Smith",
  "Carol Williams",
  "David Brown",
  "Eva Davis",
  "Frank Miller",
  "Grace Wilson",
  "Henry Moore",
  "Isla Taylor",
  "Jack Anderson",
  "Kara Thomas",
  "Liam Jackson",
  "Mia White",
  "Noah Harris",
  "Olivia Martin",
  "Paul Thompson",
  "Quinn Garcia",
  "Rachel Martinez",
  "Sam Robinson",
  "Tina Clark",
  "Uma Rodriguez",
  "Victor Lewis",
  "Wendy Lee",
  "Xander Walker",
  "Yara Hall",
  "Zane Allen",
  "Amy Young",
  "Brian King",
  "Chloe Wright",
  "Dylan Scott",
  "Ella Green",
  "Finn Adams",
  "Gina Baker",
  "Harvey Nelson",
  "Ivy Hill",
  "Jake Campbell",
  "Katie Mitchell",
  "Leo Perez",
  "Megan Roberts",
  "Nathan Turner",
  "Olive Phillips",
  "Peter Parker",
  "Queen Foster",
  "Ruby Rivera",
  "Sean Simmons",
  "Tess Evans",
  "Ulysses Hayes",
  "Vera Price",
  "Will Brooks",
  "Zoe Bennett",
  "Aaron Hughes",
  "Beatrice Stone",
  "Caleb Long",
  "Diana Rivera",
  "Ethan Woods",
  "Faith Cooper",
  "Gavin Morgan",
  "Hailey Cox",
  "Ian Gray",
  "Jasmine Butler",
  "Kyle Patterson",
  "Laura Flores",
  "Mason Jenkins",
  "Natalie Price",
  "Owen Barnes",
  "Penelope Murphy",
  "Quentin Ray",
  "Rebecca Dean",
  "Scott Hayes",
  "Tracy Owens",
  "Umar Benson",
  "Vanessa Holland",
  "Wesley Reid",
  "Ximena Norris",
  "Yusuf Blake",
  "Zara Walsh",
  "Angel Rivera",
  "Brandon Ford",
  "Cindy Bishop",
  "Derek Weber",
  "Elsa Gordon",
  "Felix Romero",
  "Gemma Daniels",
  "Harley Greene",
  "Iris Norton",
  "Jonah Vaughn",
  "Kelsey Carr",
  "Landon Ortega",
  "Mila Barrett",
  "Nolan Jimenez",
  "Opal Franklin",
  "Preston Lane",
  "Queenie Barker",
  "Ryder Lambert",
  "Sophie Marsh",
  "Trent Waters",
  "Uriah Dean",
  "Valerie Newton",
  "Wyatt Cain",
  "Xyla Savage",
];

const names = addToNamesList(defaultNames);
function randomDate(startYear = 2000, endYear = 2015) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  const randomStartTime = start + Math.random() * (end - start);
  const randomStart = new Date(randomStartTime);
  const duration = (4 + Math.random() * 2) * 365 * 24 * 60 * 60 * 1000;
  const randomEnd = new Date(randomStartTime + duration);
  return {
    startDate: randomStart.toISOString().split("T")[0],
    endDate: randomEnd.toISOString().split("T")[0],
  };
}

const tempNodes: GraphNode[] = names.map((name, i) => {
  const designation =
    designations[Math.floor(Math.random() * designations.length)];
  const university =
    universities[Math.floor(Math.random() * universities.length)];
  const dates = randomDate();

  return {
    id: (i + 1).toString(),
    name,
    img: imagesArray[i % imagesArray.length],
    group: groups[i % groups.length],
    address: addresses[Math.floor(Math.random() * addresses.length)],
    designation: designation.title,
    designationDescription: designation.desc,
    university: {
      schoolName: university.school,
      degree: university.degree,
      startDate: dates.startDate,
      endDate: dates.endDate,
    },
    noOfPeers: 0,
    noOfFollowers: 0,
    patientsServed: Math.floor(Math.random() * 9000) + 1000,
    successRate: parseFloat((85 + Math.random() * 15).toFixed(1)),
  };
});

export const links: GraphLink[] = generateSparseLinks(tempNodes);

// Create adjacency map
const adjMap: Record<string, Set<string>> = {};
links.forEach(({ source, target }) => {
  const s = typeof source === "string" ? source : source.id;
  const t = typeof target === "string" ? target : target.id;
  if (!adjMap[s]) adjMap[s] = new Set();
  if (!adjMap[t]) adjMap[t] = new Set();
  adjMap[s].add(t);
  adjMap[t].add(s);
});

// BFS to compute followers
function computeFollowers(startId: string): Set<string> {
  const visited = new Set<string>();
  const queue = [startId];
  while (queue.length) {
    const current = queue.shift()!;
    if (!visited.has(current)) {
      visited.add(current);
      for (const neighbor of adjMap[current] || []) {
        if (!visited.has(neighbor)) queue.push(neighbor);
      }
    }
  }
  visited.delete(startId);
  return visited;
}

export const nodes: GraphNode[] = tempNodes.map((node) => {
  const peers = adjMap[node.id]?.size ?? 0;
  const followers = computeFollowers(node.id).size;
  return {
    ...node,
    noOfPeers: peers,
    noOfFollowers: peers + followers,
  };
});

export function generateSparseLinks(nodes: GraphNode[]): GraphLink[] {
  const links: GraphLink[] = [];
  const linkSet = new Set<string>();
  const nodeCount = nodes.length;
  const multiLinkNodes = new Set<number>();

  while (multiLinkNodes.size < Math.floor(nodeCount * 0.25)) {
    multiLinkNodes.add(Math.floor(Math.random() * nodeCount));
  }

  for (let i = 0; i < nodeCount; i++) {
    const sourceNode = nodes[i];
    const targetCount = multiLinkNodes.has(i)
      ? Math.floor(Math.random() * 2) + 2
      : 1;

    const targets = new Set<number>();
    while (targets.size < targetCount) {
      const randIndex = Math.floor(Math.random() * nodeCount);
      if (randIndex !== i && !targets.has(randIndex)) {
        const targetNode = nodes[randIndex];
        const key = `${sourceNode.id}-${targetNode.id}`;
        const reverseKey = `${targetNode.id}-${sourceNode.id}`;
        if (!linkSet.has(key) && !linkSet.has(reverseKey)) {
          linkSet.add(key);
          targets.add(randIndex);
          links.push({ source: sourceNode.id, target: targetNode.id });
        }
      }
    }
  }

  return links;
}
