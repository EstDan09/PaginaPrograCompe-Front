import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type FaqItem = {
  q: string;
  a: string;
  tags?: string[];
};

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  query = signal('');
  openIndex = signal<number | null>(0);

  faqs: FaqItem[] = [
    // --- Platform
    {
      q: 'What is CFTrainer?',
      a: 'CFTrainer is a Codeforces companion. It helps you organize your practice, track statistics, follow friends, and work with groups and assignments in a more structured way.',
      tags: ['general', 'platform'],
    },
    {
      q: 'Do I need a Codeforces account to use CFTrainer?',
      a: 'Yes, if you want real statistics and account verification. You can browse some sections without verification, but the full experience depends on your Codeforces handle.',
      tags: ['general', 'codeforces'],
    },
    {
      q: 'What does it mean to “verify” my account?',
      a: 'Verification confirms that a Codeforces handle actually belongs to you. The system gives you a token and instructions, then checks that you completed the required action.',
      tags: ['account', 'verification'],
    },

    // --- Codeforces
    {
      q: 'What is Codeforces?',
      a: 'Codeforces is a competitive programming platform where you solve problems, participate in contests, and receive a rating that reflects your performance.',
      tags: ['codeforces', 'basics'],
    },
    {
      q: 'What is the Codeforces rating?',
      a: 'The rating is a number that goes up or down based on your performance in contests. Solving standalone problems helps you practice, but rating mainly changes through contests.',
      tags: ['codeforces', 'rating'],
    },
    {
      q: 'What are problem “tags” (greedy, dp, graphs…)?',
      a: 'Tags describe the main topic of a problem (for example greedy, dp, graphs). They help you practice specific areas and understand your strengths and weaknesses.',
      tags: ['codeforces', 'tags'],
    },

    // --- Stats
    {
      q: 'Where do my statistics come from?',
      a: 'Your stats combine data from Codeforces with internal CFTrainer data (such as groups or verification). If something looks incomplete, it may be due to caching or missing history.',
      tags: ['stats', 'data'],
    },
    {
      q: 'Why can my rating graph appear empty?',
      a: 'This can happen if the backend is not yet returning the historical rating series (ratingGraph.series). Once data is available, the graph updates automatically.',
      tags: ['stats', 'rating'],
    },
    {
      q: 'What does “range: 7d / 30d / 90d / all” mean?',
      a: 'It defines the time window for your metrics (last 7 days, 30 days, 90 days, or all time). Not all KPIs behave the same across ranges.',
      tags: ['stats', 'range'],
    },

    // --- Groups / Assignments
    {
      q: 'What are groups (teams) in CFTrainer?',
      a: 'Groups allow coaches or admins to organize students, assign tasks, and track progress in a more structured way.',
      tags: ['groups', 'coach'],
    },
    {
      q: 'What is an assignment?',
      a: 'An assignment is a task within a group. It usually includes a description, a due date, and a list of exercises or problems to solve.',
      tags: ['assignment', 'groups'],
    },
    {
      q: 'How can I see the members of a group?',
      a: 'On the group page, click “View members”. A popup will show the list of group member usernames.',
      tags: ['groups', 'members'],
    },

    // --- Friends / Following
    {
      q: 'What does “Following” mean?',
      a: 'It is the list of users you follow inside the app. It helps you keep track of friends and enables social features.',
      tags: ['friends', 'following'],
    },
    {
      q: 'What does the /following endpoint return?',
      a: 'It returns an object with a “following” property containing an array of usernames. The UI displays it as a list.',
      tags: ['friends', 'api'],
    },

    // --- Security / Account
    {
      q: 'Do you store my Codeforces password?',
      a: 'No. CFTrainer never asks for or stores your Codeforces password. Verification is done via tokens and actions, not credentials.',
      tags: ['security', 'account'],
    },
    {
      q: 'What happens when I log out?',
      a: 'The local session token is removed and the in-memory user data is cleared. To access the app again, you must log in.',
      tags: ['security', 'account'],
    },
  ];

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.faqs;

    return this.faqs.filter((item) => {
      const inQ = item.q.toLowerCase().includes(q);
      const inA = item.a.toLowerCase().includes(q);
      const inTags = (item.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return inQ || inA || inTags;
    });
  });

  setQuery(v: string) {
    this.query.set(v);
    this.openIndex.set(0);
  }

  toggle(i: number) {
    this.openIndex.set(this.openIndex() === i ? null : i);
  }

  clear() {
    this.query.set('');
    this.openIndex.set(0);
  }
}
