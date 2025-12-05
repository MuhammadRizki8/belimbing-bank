import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CreditCard, Landmark, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to <span className="text-green-600">Belimbing Bank</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">By Muhammad Rizki - Full Stack Developer Candidate</p>
      </div>

      <div className="mt-10 max-w-4xl w-full grid gap-8 sm:grid-cols-1 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-green-600" />
              <CardTitle>Manage Customers</CardTitle>
            </div>
            <CardDescription>View, create, and edit customer profiles.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/customers" passHref>
              <Button className="w-full">Go to Customers</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8 text-green-600" />
              <CardTitle>Manage Accounts</CardTitle>
            </div>
            <CardDescription>Oversee savings accounts and their transactions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/accounts" passHref>
              <Button className="w-full">Go to Accounts</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Landmark className="h-8 w-8 text-green-600" />
              <CardTitle>Configure Products</CardTitle>
            </div>
            <CardDescription>Define and manage different types of savings products.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/deposito-types" passHref>
              <Button className="w-full">Go to Deposito Types</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
