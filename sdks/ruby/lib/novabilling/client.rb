# frozen_string_literal: true

module Novabilling
  class Client
    # @param base_url [String, nil]
    # @param token [String]
    #
    # @return [void]
    def initialize(token:, base_url: nil)
      @raw_client = Novabilling::Internal::Http::RawClient.new(
        base_url: base_url || Novabilling::Environment::DEFAULT,
        headers: {
          "X-Fern-Language" => "Ruby",
          Authorization: "Bearer #{token}"
        }
      )
    end

    # @return [Novabilling::Auth::Client]
    def auth
      @auth ||= Novabilling::Auth::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Tenants::Client]
    def tenants
      @tenants ||= Novabilling::Tenants::Client.new(client: @raw_client)
    end

    # @return [Novabilling::APIKeys::Client]
    def api_keys
      @api_keys ||= Novabilling::APIKeys::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Currencies::Client]
    def currencies
      @currencies ||= Novabilling::Currencies::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Customers::Client]
    def customers
      @customers ||= Novabilling::Customers::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Plans::Client]
    def plans
      @plans ||= Novabilling::Plans::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Subscriptions::Client]
    def subscriptions
      @subscriptions ||= Novabilling::Subscriptions::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Invoices::Client]
    def invoices
      @invoices ||= Novabilling::Invoices::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Payments::Client]
    def payments
      @payments ||= Novabilling::Payments::Client.new(client: @raw_client)
    end

    # @return [Novabilling::PaymentProviders::Client]
    def payment_providers
      @payment_providers ||= Novabilling::PaymentProviders::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Webhooks::Client]
    def webhooks
      @webhooks ||= Novabilling::Webhooks::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Analytics::Client]
    def analytics
      @analytics ||= Novabilling::Analytics::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Coupons::Client]
    def coupons
      @coupons ||= Novabilling::Coupons::Client.new(client: @raw_client)
    end

    # @return [Novabilling::AddOns::Client]
    def add_ons
      @add_ons ||= Novabilling::AddOns::Client.new(client: @raw_client)
    end

    # @return [Novabilling::CreditNotes::Client]
    def credit_notes
      @credit_notes ||= Novabilling::CreditNotes::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Portal::Client]
    def portal
      @portal ||= Novabilling::Portal::Client.new(client: @raw_client)
    end

    # @return [Novabilling::BillableMetrics::Client]
    def billable_metrics
      @billable_metrics ||= Novabilling::BillableMetrics::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Events::Client]
    def events
      @events ||= Novabilling::Events::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Charges::Client]
    def charges
      @charges ||= Novabilling::Charges::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Wallets::Client]
    def wallets
      @wallets ||= Novabilling::Wallets::Client.new(client: @raw_client)
    end

    # @return [Novabilling::PaymentMethods::Client]
    def payment_methods
      @payment_methods ||= Novabilling::PaymentMethods::Client.new(client: @raw_client)
    end

    # @return [Novabilling::Taxes::Client]
    def taxes
      @taxes ||= Novabilling::Taxes::Client.new(client: @raw_client)
    end

    # @return [Novabilling::PlanOverrides::Client]
    def plan_overrides
      @plan_overrides ||= Novabilling::PlanOverrides::Client.new(client: @raw_client)
    end
  end
end
