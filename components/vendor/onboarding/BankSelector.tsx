'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { toast } from 'sonner';
import {
  useGetBankVerificationBanks,
  usePostBankVerificationBanksVerify,
} from '@/lib/api/bank-verification/bank-verification';
import type { GetBankVerificationBanks200 } from '@/lib/api/marketplaceAPI.schemas';

interface BankSelectorProps {
  value?: string;
  onBankSelect: (bankCode: string, bankName: string) => void;
  onAccountVerification?: (accountName: string) => void;
  accountNumber?: string;
  disabled?: boolean;
}

const BankSelector = ({
  value,
  onBankSelect,
  onAccountVerification,
  accountNumber,
  disabled = false,
}: BankSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<{
    code: string;
    name: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedAccountNumber, setVerifiedAccountNumber] =
    useState<string>('');

  // Debounce timer for account verification
  const verificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: banksData,
    isLoading: banksLoading,
    error: banksError,
  } = useGetBankVerificationBanks({ country: 'ghana' });
  const { mutateAsync: verifyAccount } =
    usePostBankVerificationBanksVerify();

  const banks =
    (banksData?.data as GetBankVerificationBanks200)?.banks || [];

  // Sync value prop with selectedBank state
  useEffect(() => {
    console.log('Value sync effect:', {
      value,
      banksLength: banks.length,
      currentSelectedBank: selectedBank,
    });

    if (value && banks.length > 0) {
      const bank = banks.find((b) => b.code === value);
      console.log('Found bank for value:', bank);
      if (bank) {
        setSelectedBank({
          code: bank.code || '',
          name: bank.name || '',
        });
      }
    }
  }, [value, banks]);

  // Check if account number has changed and reset verification if needed
  useEffect(() => {
    if (
      accountNumber &&
      verifiedAccountNumber &&
      accountNumber !== verifiedAccountNumber
    ) {
      console.log(
        'Account number changed, resetting verification state'
      );
      setIsVerified(false);
      setVerifiedAccountNumber('');
      onAccountVerification?.(''); // Clear the account name in the form
    }
  }, [accountNumber, verifiedAccountNumber, onAccountVerification]);

  // Debounced verification trigger
  useEffect(() => {
    // Clear any existing timer
    if (verificationTimerRef.current) {
      clearTimeout(verificationTimerRef.current);
    }

    // Only trigger verification if we have all required data and not already verified
    if (
      selectedBank?.code &&
      accountNumber &&
      accountNumber.trim().length > 0 &&
      !isVerified &&
      !isVerifying
    ) {
      // Set a 1.5 second delay to prevent spam during typing
      verificationTimerRef.current = setTimeout(() => {
        console.log('Debounced verification triggered');
        handleAccountVerification();
      }, 1500);
    }

    // Cleanup timer on unmount
    return () => {
      if (verificationTimerRef.current) {
        clearTimeout(verificationTimerRef.current);
      }
    };
  }, [accountNumber, selectedBank?.code, isVerified, isVerifying]);

  // Handle account verification
  const handleAccountVerification = async () => {
    if (
      !selectedBank?.code ||
      !accountNumber ||
      isVerified ||
      isVerifying
    ) {
      return;
    }

    setIsVerifying(true);
    try {
      console.log('Account verification triggered:', {
        accountNumber,
        bankCode: selectedBank.code,
        bankName: selectedBank.name,
      });

      const result = await verifyAccount({
        data: {
          accountNumber,
          bankCode: selectedBank.code,
        },
      });

      console.log('Account verification result:', result);

      if (result.data.verification?.account_name) {
        const accountName = result.data.verification.account_name;
        onAccountVerification?.(accountName);
        setIsVerified(true);
        setVerifiedAccountNumber(accountNumber);
        toast.success('Account verified successfully!');
      } else {
        toast.error('Failed to verify account');
        setIsVerified(false);
      }
    } catch (error) {
      console.error('Account verification failed:', error);
      toast.error('Failed to verify account. Please try again.');
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBankSelect = (bankCode: string, bankName: string) => {
    console.log('Bank selected:', { bankCode, bankName });
    setSelectedBank({ code: bankCode, name: bankName });
    onBankSelect(bankCode, bankName);
    setOpen(false);

    // Reset verification state when bank changes
    setIsVerified(false);
    setVerifiedAccountNumber('');
    onAccountVerification?.('');
  };

  const handleManualVerify = async () => {
    if (
      !selectedBank?.code ||
      !accountNumber ||
      accountNumber.trim().length === 0
    ) {
      toast.error('Please select a bank and enter an account number');
      return;
    }

    if (isVerified && accountNumber === verifiedAccountNumber) {
      toast.info('Account is already verified');
      return;
    }

    handleAccountVerification();
  };

  if (banksError) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        Failed to load banks. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled || banksLoading}>
            {banksLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading banks...
              </>
            ) : selectedBank ? (
              selectedBank.name
            ) : (
              'Select a bank...'
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search banks..." />
            <CommandList>
              <CommandEmpty>No bank found.</CommandEmpty>
              <CommandGroup>
                {banks.map((bank) => (
                  <CommandItem
                    key={bank.code}
                    value={`${bank.name} ${bank.code}`}
                    onSelect={() =>
                      handleBankSelect(
                        bank.code || '',
                        bank.name || ''
                      )
                    }>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedBank?.code === bank.code
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{bank.name}</span>
                      <span className="text-sm text-muted-foreground">
                        Code: {bank.code}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Manual Verify Button */}
      {selectedBank?.code &&
        accountNumber &&
        accountNumber.trim().length > 0 && (
          <div className="space-y-2">
            {isVerified && accountNumber === verifiedAccountNumber ? (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                ✓ Account verified: {selectedBank.name} -{' '}
                {accountNumber}
              </div>
            ) : (
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                Ready to verify: {selectedBank.name} - {accountNumber}
              </div>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleManualVerify}
              disabled={
                isVerifying ||
                (isVerified &&
                  accountNumber === verifiedAccountNumber)
              }
              className="w-full">
              {isVerifying
                ? 'Verifying...'
                : isVerified &&
                    accountNumber === verifiedAccountNumber
                  ? 'Account Verified ✓'
                  : 'Verify Account Number'}
            </Button>
          </div>
        )}
    </div>
  );
};

export default BankSelector;
