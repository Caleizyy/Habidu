import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { ROUTES } from '@/constants/Routes.constants';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">404</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <p className="text-muted-foreground">This page doesn’t exist or has been moved.</p>
        </CardContent>

        <CardFooter className="flex justify-center gap-4">
          <Button onClick={() => navigate(ROUTES.HOME)}>Return to Home</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
