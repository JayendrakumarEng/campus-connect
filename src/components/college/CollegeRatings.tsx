import { Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const ratings = [
  { source: 'Google Reviews', rating: 4.1, total: '1.2K+ reviews', color: 'text-yellow-500' },
  { source: 'Shiksha', rating: 3.9, total: '455 reviews', color: 'text-blue-500' },
  { source: 'Careers360', rating: 3.8, total: '300+ reviews', color: 'text-green-500' },
];

const breakdownItems = [
  { label: 'Placements', value: 3.7 },
  { label: 'Infrastructure', value: 4.0 },
  { label: 'Faculty', value: 3.8 },
  { label: 'Campus Life', value: 4.2 },
  { label: 'Value for Money', value: 3.9 },
];

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        className={`h-4 w-4 ${i <= Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : i - 0.5 <= rating ? 'fill-yellow-400/50 text-yellow-400' : 'text-muted'}`}
      />
    ))}
  </div>
);

const CollegeRatings = () => (
  <section className="py-16 bg-background">
    <div className="container max-w-5xl">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-foreground">Ratings & Reviews</h2>
        <p className="mt-2 text-muted-foreground">See what students and platforms say about TINT</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {ratings.map(r => (
          <Card key={r.source} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-8 pb-6">
              <div className={`text-4xl font-black ${r.color}`}>{r.rating}</div>
              <StarDisplay rating={r.rating} />
              <p className="mt-2 font-semibold text-foreground">{r.source}</p>
              <p className="text-xs text-muted-foreground">{r.total}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold text-foreground mb-4">Rating Breakdown</h3>
          <div className="space-y-4">
            {breakdownItems.map(item => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="w-32 text-sm font-medium text-foreground">{item.label}</span>
                <Progress value={item.value * 20} className="flex-1 h-3" />
                <span className="w-10 text-sm font-bold text-foreground text-right">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
);

export default CollegeRatings;
